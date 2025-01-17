import React from 'react';
import {Form, FormGroup, TextInput} from '@patternfly/react-core';
import axios from "../axios-middleware";

export class ServiceSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputError: "",
            unexpectedError: false,
            price: "Calculating..."
        };
    }

    componentDidMount() {
        this.fetchPricingData();
    }

    fetchPricingData = () => {

        const formData = {
            "tier": localStorage.getItem("tier") || "",
            "avgConcurrentShoppers": localStorage.getItem("avgConcurrentShoppers") || 0,
            "peakConcurrentShoppers": localStorage.getItem("peakConcurrentShoppers") || 0,
            "fromTime": localStorage.getItem("fromTime") || null,
            "toTime": localStorage.getItem("toTime") || null
        }

        console.log('before sending:' + JSON.stringify(formData))
        axios
            .post("/subscribe/calculate-price", formData)
            .then((res) => {
                try {
                    console.log('after sending:' + JSON.stringify(res.data))
                    localStorage.setItem("calculatedPrice", res.data)
                    this.setState({
                        price: res.data
                    })
                } catch (e) {
                    this.setState({
                        inputError: "Incompatible browser. Please use an updated browser.",
                        unexpectedError: true,
                    })
                }
            })
            .catch((err) => {
                console.error(JSON.stringify(err))
            })
    };

    getSelectedTier = () => {
        return localStorage.getItem("tier") || this.props.tier || "";
    }
    render() {
        return <Form>

            <FormGroup label="Selected Tier" fieldId="simple-form-email-01"
                       helperText="Expected average number of parallel users in the system.">
                <TextInput isDisabled={true} type="text" id="simple-form-email-01" name="simple-form-email-01"
                           value={this.getSelectedTier()}/>
            </FormGroup>
            <FormGroup label="Monthly cost" fieldId="simple-form-email-02"
                       helperText="Expected monthly cost based on selected Tier and expected usage.">
                <TextInput isDisabled={true} type="text" id="simple-form-email-02" name="simple-form-email-02"
                           value={this.state.price}/>
            </FormGroup>
        </Form>;
    }
}