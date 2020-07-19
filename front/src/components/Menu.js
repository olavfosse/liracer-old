import React from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

const Menu = ({ onClickStartGame, onClickJoinGame }) => (
  <Container className="container-fluid py-4 vw-100 vh-100">
    <Row className="h-100 align-items-center p-0 m-0">
      <Col/>
      <Col className="col-8">
        <h1 className="text-center">LiRacer</h1>
        <p className="text-center">This is a game where you compete to write a source code quote as fast as possible!</p>
        <div className="d-flex justify-content-around">
          <Button onClick={onClickStartGame} style={{width: "250px"}}>Start A Game</Button>
          <Button onClick={onClickJoinGame} style={{width: "250px"}}>Join A Game</Button>
        </div>
      </Col>
      <Col/>
    </Row>
  </Container>
)

export default Menu