import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Header, List } from "semantic-ui-react";

function App() {
  const [activities, setAtivities] = useState([]);
  useEffect(() => {
    axios.get("https://localhost:5001/api/activities").then((res) => {
      console.log(res);
      setAtivities(res.data);
    });
  }, []);

  return (
    <div>
      <Header as="h2" icon="users" content="Reactivities" />
        <List>
          {activities.map((activity: any) => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
    </div>
  );
}

export default App;
