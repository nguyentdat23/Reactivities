import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid, Loader } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ActivitiesList from "./ActivitiesList";
import ActivityFilters from "./ActivityFilters";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();

  const { groupedActivities, loadingActivities, setPagingParams, pagination } =
    activityStore;

  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    if (pagination) {
      setLoadingNext(true);
      setPagingParams(new PagingParams(pagination.currentPage + 1));
      loadingActivities().then(() => {
        setLoadingNext(false);
      })
    }
  }
  useEffect(() => {
    if (groupedActivities.length <= 1) loadingActivities();
  });


  return (

    <Grid>
      <Grid.Column width="10">

        {activityStore.loadingInitial && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
            initialLoad={false}>
            <ActivitiesList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width="6" style={{ paddingTop: "6vh" }}>
        <ActivityFilters></ActivityFilters>
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
});
