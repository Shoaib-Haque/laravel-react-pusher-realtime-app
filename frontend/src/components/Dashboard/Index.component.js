import React, { useEffect, useState, useCallback  } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Pusher from "pusher-js";

import Layout from "../Layout/User/Layout.Component";
import Loader from "../Loader/Loader.component";

import Swal from "sweetalert2";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search, CSVExport} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CloseButton from 'react-bootstrap/CloseButton';
import ListGroup from 'react-bootstrap/ListGroup';
import ROW from 'react-bootstrap/ROW';
import COL from "react-bootstrap/COL";

export default function Index() {
  const navigate = useNavigate();
  const [TITLE, setTitle] = useState("");
  const token = localStorage.getItem("authToken");
  const user_id = localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);
  const [chatBoxes, setChatBoxes] = useState([]);
  const [pusherChannel, setPusherChannel] = useState(null);
  //const [chat_box_col_class_name, setChatBoxColClassName] = useState('');

  const [list, setList] = useState([]);
  const columns = [
    {
      text: "",
      dataField: "user_name",
      headerAttrs: {
        hidden: true,
      },
    },
  ];
  const { SearchBar } = Search;

// TRIGGERED ON MOUNT
useEffect(() => {
    index();
    const pusher = new Pusher(`${process.env.REACT_APP_PUSHER_API_KEY}`, {
        cluster: `${process.env.REACT_APP_PUSHER_CLUSTER}`,
    });
    const channel = pusher.subscribe("chat-channel." + user_id);
    setPusherChannel(channel);
  }, []);

// TRIGGERED ON CHANGE IN "data"
useEffect(() => {
  if(pusherChannel && pusherChannel.bind){
    var flag = false;
    pusherChannel.unbind("new-message");
    pusherChannel.bind("new-message", (pusherData) => {
      const newState1 = chatBoxes.map((chatBox, index) => {
          if (chatBox.receiver_id == pusherData.sender_id) {
              flag = true;
              console.log(flag);
              chatBox.messages.unshift(pusherData);
              return { ...chatBox, messages: chatBox.messages };
          }
          return chatBox;
      });
      setChatBoxes(newState1);
      if(!flag) {
        getChatMessages(pusherData.sender_id, function(response) {
          var user = list.find((item) => item.id == pusherData.sender_id);
          let obj = {'receiver_id' : pusherData.sender_id, 'receiver_name' : user.user_name, 'messages' : response};
          const newChatBoxes = [obj, ...chatBoxes];//[...chatBoxes, obj];
          setChatBoxes(newChatBoxes);
      });
      }
    });
  }
}, [pusherChannel, chatBoxes, list]);

  const index = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setList(data.users);
        setTitle("User List");
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
    setLoading(false);
  };

  const getChatMessages = function(receiver_id, callback) {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}messages/${receiver_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response =>{
        callback(response.data);
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          console.log(response);
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  const send = async (receiver_id, message) => {
    const formData = new FormData();
    formData.append("receiver_id", receiver_id);
    formData.append("message", message);
    const token = localStorage.getItem("authToken");
    var api = `${process.env.REACT_APP_API_BASE_URL}messages`;

    await axios
      .post(api, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const newState = chatBoxes.map((chatBox, index) => {
          if (chatBox.receiver_id == data.message.receiver_id) {
            chatBox.messages.unshift(data.message);
            return { ...chatBox, messages: chatBox.messages };
          }
          return chatBox;
        });
        setChatBoxes(newState);
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  const onSubmitClick = async (e) => {
    e.preventDefault();
    send(e.target.receiver_id.value, e.target.message.value);
    e.target.message.value = "";
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      var form = e.target.form;
      send(form.receiver_id.value, form.message.value);
      form.message.value = "";
    }
  };

  const rowEvents = {
  onClick: (e, row, rowIndex) => {
    let flag = false;
    chatBoxes &&
    chatBoxes.length > 0 &&
    chatBoxes.map((chatBox, index) => {
      if(chatBox.receiver_id === row.id){
        flag = true;
      }
    })
    if(!flag) {
      getChatMessages(row.id, function(response) {
        let obj = {'receiver_id' : row.id, 'receiver_name' : row.user_name, 'messages' : response};
        const newChatBoxes = [...chatBoxes, obj];
        setChatBoxes(newChatBoxes);
      });
    }
    }
  };

  const closeChatBox = (index) => {
    const list = chatBoxes.slice();
    list.splice(index, 1);
    setChatBoxes(list);
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Layout TITLE={TITLE}>
          <Row className="px-1">
            <Col xs={6} md={8} lg={8} xl={9}>
              <Row className="d-flex justify-content-end text-nowrap chatbox-parent-row">
                {chatBoxes &&
                  chatBoxes.length > 0 &&
                  chatBoxes.map((chatBox, index) => (
                    <Col
                      className={`chatbox_div ${
                        (index === chatBoxes.length - 1 &&
                          window.innerWidth < 950) ||
                        (chatBoxes.length - (index + 1) <= 1 &&
                          window.innerWidth >= 950 &&
                          window.innerWidth < 1200) ||
                        (chatBoxes.length - (index + 1) <= 2 &&
                          window.innerWidth > 1200)
                          ? "d-block"
                          : "d-none"
                      }`}
                    >
                      <Card>
                        <Card.Header>
                          <Row>
                            <Col>{chatBox.receiver_name}</Col>
                            <Col className="d-flex justify-content-end">
                              <CloseButton
                                onClick={(event) => {
                                  closeChatBox(index);
                                }}
                              />
                            </Col>
                          </Row>
                        </Card.Header>
                        <Card.Body className="card-body-scroll text-wrap">
                          {chatBox.messages &&
                            chatBox.messages.length > 0 &&
                            chatBox.messages.map((message, messageIndex) => (
                              <ROW
                                className={`d-flex mt-1 ${
                                  message.sender_id == user_id
                                    ? "justify-content-end ps-3"
                                    : "justify-content-start pe-3"
                                }`}
                              >
                                <COL
                                  xs={10}
                                  className={`border border-1 rounded-3 px-1 content-width ${
                                    message.sender_id == user_id
                                      ? "justify-content-end bg-primary text-white"
                                      : "justify-content-start bg-secondary text-white"
                                  }`}
                                  key={messageIndex}
                                >
                                  {message.message}
                                </COL>
                              </ROW>
                            ))}
                        </Card.Body>
                        <Card.Footer className="p-1 border-top-0 bg-transparent">
                          <Form onSubmit={onSubmitClick}>
                            <Form.Group controlId="receiver_id">
                              <Form.Control
                                type="hidden"
                                value={chatBox.receiver_id}
                                name="receiver_id"
                              />
                            </Form.Group>
                            <Form.Group className="mb-1" controlId="message">
                              <Form.Control
                                as="textarea"
                                required
                                type="text"
                                placeholder="Aa"
                                name="message"
                                className="message"
                                onKeyDown={(event) => {
                                  onEnterPress(event);
                                }}
                              />
                            </Form.Group>
                            <Button
                              type="submit"
                              variant="primary"
                              size="sm"
                              className="btn btn-block button"
                            >
                              Send
                            </Button>
                          </Form>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Col>
            <Col xs={6} md={4} lg={4} xl={3} className="h-100">
              <Row className="justify-content-center text-nowrap h-50">
                <Col>
                  <Card>
                    <Card.Body>
                      {list.length ? (
                        <ToolkitProvider
                          keyField="Id"
                          data={list}
                          columns={columns}
                          search
                          bootstrap4
                        >
                          {(props) => (
                            <Row>
                              <Col>
                                <Row className="mt-1">
                                  <Col>
                                    <SearchBar
                                      {...props.searchProps}
                                      srText=""
                                      placeholder="Search..."
                                      className="search-bar"
                                    />
                                  </Col>
                                </Row>
                                <Row className="mt-2 scroll-div">
                                  <Col>
                                    <BootstrapTable
                                      bootstrap4
                                      width="100vw;"
                                      hover
                                      condensed
                                      bordered={false}
                                      wrapperClasses="table-responsive"
                                      rowEvents={rowEvents}
                                      {...props.baseProps}
                                    ></BootstrapTable>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </ToolkitProvider>
                      ) : (
                        <Row>
                          <Col>Nothing to Show</Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Layout>
      )}
    </>
  );
}
