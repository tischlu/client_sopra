import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import Register from "../register/Register";
import queryString from "query-string";


const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 675px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;
const Label2 = styled.label`
  color: black;
  margin-bottom: 10px;
  text-transform: uppercase;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.stae = {
            user: null,
            id: null
        };
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const values = queryString.parse(this.props.location.search);
        await this.setState({ id: values.id });
        fetch(`${getDomain()}/users/${this.state.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(async response => {
                if (!response.ok) {
                    const errorMsg = await response.json();
                    const errorURL =
                        "/error?code=" +
                        response.status +
                        "&error=" +
                        errorMsg.error +
                        "&message=" +
                        errorMsg.message;
                    this.props.history.push(errorURL);
                    return null;
                } else {
                    return response.json();
                }
            })

            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <h2>Name</h2>
                        <Label>{this.state.user.name}</Label>

                        <h2>Username:</h2>
                        <Label>username</Label>

                        <h2>Password:</h2>
                        <Label>......</Label>

                        <h2>Email:</h2>
                        <Label>email</Label>

                        <h2>Birthday</h2>
                        <Label>birthday</Label>

                        <ButtonContainer>
                            <Button
                                width="50%">
                                Edit
                            </Button>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.props.history.push(`/users`);
                                }}>
                                Back
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Profile);