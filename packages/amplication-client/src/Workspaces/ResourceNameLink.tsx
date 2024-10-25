import * as models from "../models";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import "./ResourceNameLink.scss";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  resource: models.Resource;
};

const CLASS_NAME = "resource-name-link";

function ResourceNameLink({ resource }: Props) {
  const { id, name, resourceType } = resource;

  const overrideIsPlatformConsole =
    models.EnumResourceType.ServiceTemplate === resourceType;

  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: id,
    overrideIsPlatformConsole: overrideIsPlatformConsole,
  });

  return (
    <Link className={CLASS_NAME} to={baseUrl}>
      <Text textStyle={EnumTextStyle.Tag}>{name}</Text>
    </Link>
  );
}

export default ResourceNameLink;
