import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { CodeGenerationLog, KAFKA_TOPICS } from "@amplication/schema-registry";
import { BuildLoggerController } from "./build-logger.controller";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";

describe("Build Logger Controller", () => {
  let controller: BuildLoggerController;
  let codeGeneratorSplitterService: CodeGeneratorSplitterService;

  const mockServiceEmitMessage = jest
    .fn()
    .mockImplementation(
      (topic: string, message: CodeGenerationLog.KafkaEvent) =>
        Promise.resolve()
    );

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BuildLoggerController],
      providers: [
        {
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: mockServiceEmitMessage,
          })),
        },
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case KAFKA_TOPICS.DSG_LOG_TOPIC:
                  return "log_topic";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: CodeGeneratorSplitterService,
          useValue: {
            extractBuildId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BuildLoggerController>(BuildLoggerController);
    codeGeneratorSplitterService = module.get<CodeGeneratorSplitterService>(
      CodeGeneratorSplitterService
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should emit `CodeGenerationLog.KafkaEvent` message on Kafka producer service", async () => {
    const spyOnCodeGeneratorSplitterServiceExtractBuildId = jest
      .spyOn(codeGeneratorSplitterService, "extractBuildId")
      .mockReturnValue("buildID");

    const mockRequestLogDOT: CodeGenerationLogRequestDto = {
      buildId: "buildID",
      level: "info",
      message: "test message",
    };

    const logEvent: CodeGenerationLog.KafkaEvent = {
      key: { buildId: mockRequestLogDOT.buildId },
      value: mockRequestLogDOT,
    };

    await controller.onCodeGenerationLog(mockRequestLogDOT);

    expect(mockServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.DSG_LOG_TOPIC,
      logEvent
    );

    expect(spyOnCodeGeneratorSplitterServiceExtractBuildId).toBeCalledTimes(1);
    await expect(mockServiceEmitMessage()).resolves.not.toThrow();
  });
});
