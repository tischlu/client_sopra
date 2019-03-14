import React from "react";
import {BaseContainer, FormContainer, Form, Label, WhiteText, ButtonContainer} from "../../helpers/layout";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import {Button} from "../../views/design/Button";


class Error extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            error: "",
            message: ""
        };
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        this.setState({"code": values.code});
        this.setState({"error": values.error});
        this.setState({"message": values.message});
    }

    back() {
        this.props.history.goBack();
    }

    render () {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>Error Code:</Label>
                        <WhiteText>{this.state.code}: {this.state.error}</WhiteText>
                        <Label>Error Message:</Label>
                        <WhiteText>{this.state.message}</WhiteText>
                        <ButtonContainer>
                            <Button
                                onClick={() => {
                                    this.back();
                                }}
                            >Back</Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Error);