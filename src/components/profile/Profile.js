import React from "react";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import Register from "../register/Register";
import queryString from "query-string";
import {Spinner} from "../../views/design/Spinner";
import styled from "styled-components";

const Container = styled(BaseContainer)`
  display: flex;
  color: white;
  text-align: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const InvisTable = styled.table`
  display: flex;
  flex-direction: column;
  border: none;
  color: inherit;
  text-align: left;
  background-color: inherit;
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
        this.state = {
            user: null,
            id: null,
            token: null,
            newUsername: null,
            newBirthday: null,
            showEditButton: false,
            showChangeUsername: false,
            showChangeBirthday: false
        };
    }

    async checkToken () {
        if(localStorage.getItem("token") === this.state.user.token) {
            this.setState({showEditButton: true})
        } else {
            this.setState({showEditButton : false})
        }
    }

    async editInfo() {
        await this.setState({user: null});
        const changes = JSON.stringify({
            username: this.state.username,
            id: this.state.id,
            birthday: this.state.birthday,
            token: this.user.token
        });

        fetch(`${getDomain()}/users/${this.state.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }, body: changes
        })
            .then(async response => {
                if (!response.ok) {
                    const errMessage = await response.json();
                    console.log(errMessage);
                    const errURL = "/error?code=" + response.status + "&error=" + errMessage.error + "&message=" + errMessage.message;
                    this.props.history.push(errURL);
                    //return null;
                } else {
                    //this.props.history.push('/game');
                    //localStorage.setItem("token", user.token);
                    return response.json();
                    //this.props.history.push('/game')
                }
            })
            .then(response => response.json())
            .then(async user => {
                await this.setState({ user: user });
                await this.setState({ newUsername: user.username });
                await this.setState({ newBirthday: user.birthday });
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong: " + err);
            });

        this.setState({
            newUsername: "username",
            newBirthday: "00.00.0000"
        });
        await this.loadData();


    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    async componentDidMount() {
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
                    alert("not ok");
                    const errorMsg = await response.json();
                    const errorURL =
                        "/error?code=" +
                        response.status +
                        "&error=" +
                        errorMsg.error +
                        "&message=" +
                        errorMsg.message;
                    this.props.history.push(errorURL);
                    //return null;
                } else {
                    return response.json();
                }
            })
            .then(async user => {
                await new Promise(resolve => setTimeout(resolve, 800));
                console.log(user);
                await this.setState({ user: user });
                await this.setState({ newUsername: user.username });
                await this.setState({ newBirthday: user.birthday });
                await this.setState( { token: user.token});
            })

            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }

    editable = () => {
        return (
            <BaseContainer>
                {!this.state.user ? (
                        <Spinner/>
                    ) :
                    <FormContainer>
                        <Form>

                            <h2>Username:</h2>
                            <InputField
                                placeholder="New username"
                                onChange={e => {
                                    this.handleInputChange("newUsername", e.target.value);
                                }}
                            />

                            <h2>Status:</h2>
                            <Label>{this.state.user.status}</Label>

                            <h2>Joined at:</h2>
                            <Label>{this.state.user.creationDate}</Label>

                            <h2>Birthday</h2>
                            <InputField
                                placeholder="DD.MM.YYYY"
                                onChange={e => {
                                    this.handleInputChange("newBirthday", e.target.value);
                                }}
                            />

                            <ButtonContainer>
                                <Button
                                    onClick={() => {
                                    this.editInfo();
                                    }}
                                    width="50%">
                                    Save
                                </Button>
                            </ButtonContainer>
                        </Form>
                    </FormContainer>
                }
            </BaseContainer>
        );
    }

/*
    render() {
        return (
            <BaseContainer>
                {!this.state.user ? (
                    <Spinner/>
                ) :
                <FormContainer>
                    <Form>

                        <h2>Username:</h2>
                        <Label>{this.state.user.username}</Label>

                        <h2>Status:</h2>
                        <Label>{this.state.user.status}</Label>

                        <h2>Joined at:</h2>
                        <Label>{this.state.user.creationDate}</Label>

                        <h2>Birthday</h2>
                        <Label>{this.state.user.birthday}</Label>

                        <ButtonContainer>
                            <Button
                                disabled={this.state.showEditButton}
                                width="50%"
                                onClick={() => {
                                    this.editable();
                                }}>
                                Edit
                            </Button>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.props.history.push(`/game`);
                                }}>
                                Back
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
                }
            </BaseContainer>
        );
    }
    */
    render() {
        return (
            <Container>
                <div>
                    {!this.state.user ? (
                        <Spinner />
                    ) : (
                        <InvisTable>
                            <tbody>
                            <tr>
                                <td>Username:</td>
                                <td>{this.state.user.username}</td>
                                <td>
                                    {localStorage.getItem("token") === this.state.token ? (
                                        !this.state.showChangeUsername ? (
                                            <Button
                                                onClick={() => {
                                                    this.setState({ showChangeUsername: true });
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        ) : (
                                            <div>
                                                <InputField
                                                    placeholder="Enter new username"
                                                    onChange={e => {
                                                        this.handleInputChange(
                                                            "newUsername",
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )
                                    ) : null}
                                </td>
                            </tr>
                            <tr>
                                <td>Status:</td>
                                <td>{this.state.user.status}</td>
                            </tr>
                            <tr>
                                <td>Join Date:</td>
                                <td>{this.state.user.creationDate}</td>
                            </tr>
                            <tr>
                                <td>Birthday:</td>
                                <td>{this.state.user.birthday}</td>
                                <td>
                                    {localStorage.getItem("token") === this.state.token ? (
                                        !this.state.showChangeBirthday ? (
                                            <Button
                                                onClick={() => {
                                                    this.setState({ showChangeBirthday: true });
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        ) : (
                                            <div>
                                                <InputField
                                                    placeholder="DD.MM.YYYY"
                                                    onChange={e => {
                                                        this.handleInputChange(
                                                            "newBirthday",
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )
                                    ) : null}
                                </td>
                            </tr>
                            </tbody>
                        </InvisTable>
                    )}
                    {this.state.showChangeBirthday || this.state.showChangeUsername ? (
                        <Button
                            width="50%"
                            onClick={() => {
                                this.editInfo();
                                this.setState({
                                    showChangeBirthday: false,
                                    showChangeUsername: false
                                });
                            }}
                        >
                            Submit Changes
                        </Button>
                    ) : null}
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.props.history.push("/game/dashboard");
                            }}
                        >
                            Back
                        </Button>
                    </ButtonContainer>
                </div>
            </Container>
        );
    }
}

export default withRouter(Profile);