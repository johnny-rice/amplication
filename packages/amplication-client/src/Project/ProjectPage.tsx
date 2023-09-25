import React, { useContext, useMemo } from "react";
import ResourceList from "../Workspaces/ResourceList";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import "./ProjectPage.scss";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import PageLayout from "../Layout/PageLayout";
import { AppContext } from "../context/appContext";
import useTabRoutes from "../Layout/useTabRoutes";
import { TabItem } from "@amplication/ui/design-system";
import PendingChange from "../VersionControl/PendingChange";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};
const OVERVIEW = "Overview";

const ProjectPage: React.FC<Props> = ({
  innerRoutes,
  match,
  moduleClass,
  tabRoutes,
  tabRoutesDef,
}) => {
  const { currentProject, pendingChanges } = useContext(AppContext);

  useBreadcrumbs(currentProject?.name, match.url);
  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const tabItems: TabItem[] = useMemo(() => {
    const tabsWithPendingChanges = tabs.map((tab) => {
      if (tab.name === "Pending Changes") {
        return {
          ...tab,
          indicatorValue: pendingChanges?.length
            ? pendingChanges.length
            : undefined,
        };
      } else return tab;
    });

    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
      },
      ...(tabsWithPendingChanges || []),
    ];
  }, [tabs, pendingChanges]);

  return match.isExact || currentRouteIsTab ? (
    <>
      <PageLayout className={moduleClass} tabs={tabItems}>
        {match.isExact ? <ResourceList /> : tabRoutes}
      </PageLayout>
    </>
  ) : (
    innerRoutes
  );
};

export default ProjectPage;
