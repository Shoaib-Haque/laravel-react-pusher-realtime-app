import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";


export default function NotFound({notFound}) {
    return (
      <div className="center">
        <Badge bg="light" text="dark" className="fs-3">
          {notFound}
        </Badge>
      </div>
    );
  }
