import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumTextStyle,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import NewTempResource from "./NewTempResource";
import { Resource } from "../../models";

const CLASS_NAME = "model-group-list";

type Props = {
  handleServiceCreated: (newResource: Resource) => void;
  onCancelChanges: () => void;
  mergeNewResourcesChanges: () => void;
};

export default function ModelsTool({
  handleServiceCreated,
  onCancelChanges,
  mergeNewResourcesChanges,
}: Props) {
  const [newService, setNewService] = useState<boolean>(false);
  const handleNewServiceClick = useCallback(() => {
    setNewService(!newService);
  }, [newService, setNewService]);

  const handleNewCreatedServiceClick = useCallback(
    (newResource: Resource) => {
      setNewService(!newService);
      handleServiceCreated(newResource);
    },
    [newService, handleServiceCreated, setNewService]
  );

  return (
    <>
      <div className={`${CLASS_NAME}__filter`}>
        <Text textStyle={EnumTextStyle.Tag}>{"Tools"}</Text>
        <Button
          className={`${CLASS_NAME}__modelToolBtn`}
          buttonStyle={EnumButtonStyle.Outline}
          onClick={onCancelChanges}
        >
          <Icon icon={"trash_2"} size="small"></Icon>
        </Button>
        <Button
          className={`${CLASS_NAME}__modelToolBtn`}
          onClick={mergeNewResourcesChanges}
          buttonStyle={EnumButtonStyle.Outline}
        >
          <Icon icon={"refresh_cw"} size="small"></Icon>
        </Button>
        <hr className={`${CLASS_NAME}__hr`} />
        <Button
          className={`${CLASS_NAME}__modelToolBtn`}
          onClick={handleNewServiceClick}
        >
          <Icon icon={"pluse"} size="small"></Icon>
        </Button>
        <Dialog
          isOpen={newService}
          onDismiss={handleNewServiceClick}
          title="New Service"
        >
          <NewTempResource
            onSuccess={handleNewCreatedServiceClick}
          ></NewTempResource>
        </Dialog>
      </div>
    </>
  );
}
