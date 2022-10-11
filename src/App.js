import { CheckCircleIcon } from "@heroicons/react/solid";
import logo from "./sm-logo.svg";

import { GlobeAltIcon, RefreshIcon } from "@heroicons/react/outline";

import {
  Card,
  Text,
  Divider,
  Icon,
  Title,
  Tracking,
  TrackingBlock,
  Flex,
  Bold,
  Button,
  Block,
  Legend,
} from "@tremor/react";

import "./App.css";
import "@tremor/react/dist/esm/tremor.css";

import { last, orderBy, head, keys, values } from "lodash";

import { useEffect, useState } from "react";
import getStatus from "./services/handles/getStatus";

import config from "./config";

const { PROJECT_ID } = config;

const App = () => {
  const [status, setStatus] = useState([]);
  const [loading, setloading] = useState(null);

  useEffect(() => {
    Promise.all(
      PROJECT_ID.map((project) =>
        getStatus(project.id).then((res) => ({
          name: project.name,
          id: project.id,
          data: orderBy(res, "updated_at", "asc"),
        }))
      )
    ).then((data) => setStatus(data));
  }, []);

  const callStatus = (id) => {
    setloading(id)
    getStatus(id).then((res) => {
      const data =  orderBy(res, "updated_at", "asc");
      setStatus((prevState) => [
        ...prevState,
        prevState[prevState.findIndex(el => el.id === id)].data = data,
      ]);
      setloading(null);
    });
  };

  const statusColors = {
    success: "emerald",
    failed: "red",
    canceled: "gray",
    Degraded: "orange",
    pending: "bleu",
    running: "blue",
  };

  const CardPipeline = ({ statusCard, name, id }) => {
    if (statusCard) {
      return (
        <Card maxWidth="max-w-2xl" marginTop="mt-5">
          <Block textAlignment="text-center">
            <Icon
              Icon={CheckCircleIcon}
              variant="light"
              size="xl"
              color={statusColors[last(statusCard).status]}
            />
            <Title marginTop="mt-2">{name}</Title>
            <Text textAlignment="text-center">
              From {new Date(last(statusCard).updated_at).toLocaleString()}
            </Text>
          </Block>
          <Divider />
          <Flex marginTop="mt-4">
            <Flex justifyContent="justify-start" spaceX="space-x-1">
              <Icon Icon={CheckCircleIcon} color="emerald" />
              <Text>
                <Bold>PIPELINE</Bold>
              </Text>
            </Flex>
          </Flex>
          <Tracking marginTop="mt-2">
            {statusCard &&
              statusCard.map((item) => (
                <TrackingBlock
                  key={item.id}
                  color={statusColors[item.status]}
                  tooltip={new Date(item.updated_at).toLocaleString()}
                />
              ))}
          </Tracking>
          <Flex marginTop="mt-2">
            <Text>
              {new Date(head(statusCard).updated_at).toLocaleString()}
            </Text>
            <Text>Today</Text>
          </Flex>
          <Flex marginTop="mt-4">
            <Button
              size="xs"
              text={loading === id ? 'Loading' : 'Refresh data'}
              Icon={RefreshIcon}
              handleClick={() => callStatus(id)}
              marginTop="mt-2"
            />
            <Button
              size="xs"
              text="WEB"
              Icon={GlobeAltIcon}
              handleClick={() =>
                (window.location.href = head(statusCard).web_url)
              }
              marginTop="mt-2"
            />
          </Flex>
        </Card>
      );
    }
  };

  return (
    <div className="App">
      <div className="contentTitle">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Pipelines</h1>
      </div>
      <div className="content">
        {status &&
          status.map((project) => (
            <>
              {project && (
                <CardPipeline
                  statusCard={project.data}
                  name={project.name}
                  id={project.id}
                />
              )}
            </>
          ))}
      </div>
      <div className="contentLegend">
        <Legend
          categories={keys(statusColors)}
          colors={values(statusColors)}
          marginTop="mt-0"
        />
      </div>
    </div>
  );
};

export default App;
