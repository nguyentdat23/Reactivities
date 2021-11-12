import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router";
import { useStore } from "../stores/store";

interface Props extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export default function PrivateRoute({ component: Component, ...rest }: Props) {
    const { accountStore } = useStore();
    console.log(accountStore.user);
    return (
        <Route
            {...rest}
            render={(props) => accountStore.user ? <Component {...props} /> : <Redirect to='/' />}
        />
    )
}