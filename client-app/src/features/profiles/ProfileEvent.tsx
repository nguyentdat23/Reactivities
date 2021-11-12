import { observer } from "mobx-react-lite"
import { SyntheticEvent } from "react";
import { Tab, TabProps } from "semantic-ui-react"
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileListEvents from "./ProfileListEvents";

export default observer(function ProfileEvent() {
    const { profileStore: { setPredicate, events, loading } } = useStore();
    const panes = [
        {
            menuItem: 'Future Events', render: () => {

                return <Tab.Pane loading={loading || !events} >
                    <ProfileListEvents userEvents={events} />
                </Tab.Pane>
            }
        },
        {
            menuItem: 'Past Events', render: () => {
                if (!events) return <LoadingComponent></LoadingComponent>
                return <Tab.Pane loading={loading || !events}>
                    <ProfileListEvents userEvents={events} />
                </Tab.Pane>
            }
        },
        {
            menuItem: 'Hosting Events', render: () => {
                if (!events) return <LoadingComponent></LoadingComponent>
                return <Tab.Pane loading={loading || !events} >
                    <ProfileListEvents userEvents={events} />
                </Tab.Pane >
            }
        },

    ];

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        switch (data.activeIndex) {
            case 0:
                setPredicate('future');
                break;
            case 1:
                setPredicate('past');
                break;
            case 2:
                setPredicate('hosting');
                break;
        };
    };

    return (
        <Tab.Pane >
            <Tab
                menu={{ secondary: true, pointing: true }}
                panes={panes}
                onTabChange={(e, data) => handleTabChange(e, data)}            >
            </Tab>
        </Tab.Pane>
    )
})