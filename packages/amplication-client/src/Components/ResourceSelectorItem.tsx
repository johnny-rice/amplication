import { formatTimeToNow } from "@amplication/design-system";
import React from "react";
import { Resource } from "../models";
import "./CommitSelectorItem.scss";
import ResourceCircleBadge from "./ResourceCircleBadge";

type Props = {
  resource: Resource | null;
};
const CLASS_NAME = "commit-selector-item";

export const ResourceSelectorItem = ({ resource }: Props) => {
  const createdAtHour = resource
    ? formatTimeToNow(new Date(resource?.createdAt))
    : null;

  return (
    <div className={CLASS_NAME}>
      {resource && (
        <>
          <ResourceCircleBadge type={resource.resourceType} size={"xsmall"} />
          <div className={`${CLASS_NAME}__title`}>{resource.name}</div>
          <label className={`commit-selector__hour`}>{createdAtHour}</label>
        </>
      )}
    </div>
  );
};
