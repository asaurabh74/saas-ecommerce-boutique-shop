import React from 'react';
import {Form, FormGroup, Popover, TextInput, ValidatedOptions} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import axios from "../axios-middleware";
import {ModalDialog} from "./ModalDialog";

export const BusinessInfoForm = () => {
    const [isModalShowing, setIsModalShowing] = React.useState(false);
    const [emailHelperText, setEmailHelperText] =
        React.useState("Email address will be used as login credentials.");
    const [passwordHelperText, setPasswordHelperText] = React.useState("");
    const [modalData, setModalData] = React.useState();
    const [email, setEmail] = React.useState(() => {
        return localStorage.getItem("email") || "";
    });
    const [password, setPassword] = React.useState(() => {
        return localStorage.getItem("password") || "";
    });
    const [confPassword, setConfPassword] = React.useState(() => {
        return localStorage.getItem("confPassword") || "";
    });
    const [confPasswordState, setConfPasswordState] = React.useState(ValidatedOptions.default);
    const [emailState, setEmailState] = React.useState(ValidatedOptions.default);

    const [tenantName, setTenantName] = React.useState(() => {
        return localStorage.getItem("tenantName") || "";
    });
    const [orgName, setOrgName] = React.useState(() => {
        return localStorage.getItem("orgName") || "";
    });
    const [orgAddress, setOrgAddress] = React.useState(() => {
        return localStorage.getItem("orgAddress") || "";
    });
    const [phone, setPhone] = React.useState(() => {
        return localStorage.getItem("phone") || "";
    });
    const [contactName, setContactName] = React.useState(() => {
        return localStorage.getItem("contactName") || "";
    });

    const onChangeEmail = email => {
        setEmail(email);
        localStorage.setItem("email", email);
    }
    const handleEmailChange = email => {
        axios
            .get("/tenant/email/" + email.target.value)
            .then((res) => {
                if (res.data === false)
                    setEmailState(ValidatedOptions.success)
                else {
                    setEmailState(ValidatedOptions.error)
                    setEmailHelperText("Provided email is already in use. " +
                        "Please try with a different email address.")
                }
            })
            .catch((err) => {
                setIsModalShowing(true)
                setModalData({
                    title: "Server Connection Failed",
                    body: err.message
                })
                setEmailState(ValidatedOptions.error)
            })
    };
    const handlePasswordChange = password => {
        localStorage.setItem("password", password);
        setPassword(password);
    };
    const handleConfPasswordChange = confPassword => {
        localStorage.setItem("confPassword", confPassword);
        if (confPassword === password) {
            setConfPasswordState(ValidatedOptions.success)
            setPasswordHelperText("")
        } else {
            setConfPasswordState(ValidatedOptions.error)
            setPasswordHelperText("Passwords do not match");
        }
        setConfPassword(confPassword);
    };
    const handleTenantNameChange = tenantName => {
        localStorage.setItem("tenantName", tenantName);
        setTenantName(tenantName);
    };
    const handleOrgNameChange = orgName => {
        localStorage.setItem("orgName", orgName);
        setOrgName(orgName);
    };
    const handleOrgAddressChange = orgAddress => {
        localStorage.setItem("orgAddress", orgAddress);
        setOrgAddress(orgAddress);
    };
    const handlePhoneChange = phone => {
        localStorage.setItem("phone", phone);
        setPhone(phone);
    };
    const handleContactPersonNameChange = contactPersonName => {
        localStorage.setItem("contactName", contactPersonName);
        setContactName(contactPersonName);
    };
    return <Form>

        <FormGroup label="Email" isRequired fieldId="simple-form-email-01"
                   helperText={emailHelperText}>
            <TextInput isRequired type="email" id="simple-form-email-01" name="simple-form-email-01" value={email}
                       onBlur={handleEmailChange} onChange={onChangeEmail} validated={emailState}/>
            {isModalShowing && <ModalDialog setIsOpen={isModalShowing} data={modalData}/>}
        </FormGroup>
        <FormGroup label="Password" isRequired fieldId="simple-form-email-02">
            <TextInput isRequired type="password" id="simple-form-email-02" name="simple-form-email-02" value={password}
                       onChange={handlePasswordChange}/>
        </FormGroup>
        <FormGroup label="Confirm Password" isRequired fieldId="simple-form-email-03"
                   helperText={passwordHelperText}>
            <TextInput isRequired type="password" id="simple-form-email-03" name="simple-form-email-03"
                       value={confPassword}
                       validated={confPasswordState}

                       onChange={handleConfPasswordChange}/>
        </FormGroup>
        <FormGroup label="Tenant Name" isRequired fieldId="simple-form-email-04"
                   labelIcon={<Popover headerContent={
                       <div>
                           Identifier for your tenant
                       </div>} bodyContent={<div>
                       This will be used as the source to construct the unique identification.
                   </div>}>
                       <button type="button" aria-label="More info for name field" onClick={e => e.preventDefault()}
                               aria-describedby="simple-form-name-04" className="pf-c-form__group-label-help">
                           <HelpIcon noVerticalAlign/>
                       </button>
                   </Popover>}
        >
            <TextInput isRequired type="text" id="simple-form-email-04" name="simple-form-email-04" value={tenantName}
                       onChange={handleTenantNameChange}/>
        </FormGroup>
        <FormGroup label="Organization Name" isRequired fieldId="simple-form-email-05">
            <TextInput isRequired type="text" id="simple-form-email-05" name="simple-form-email-05" value={orgName}
                       onChange={handleOrgNameChange}/>
        </FormGroup>
        <FormGroup label="Organization Address" isRequired fieldId="simple-form-email-06">
            <TextInput isRequired type="text" id="simple-form-email-06" name="simple-form-email-06" value={orgAddress}
                       onChange={handleOrgAddressChange}/>
        </FormGroup>
        <FormGroup label="Phone Number" isRequired fieldId="simple-form-phone-07">
            <TextInput isRequired type="tel" id="simple-form-phone-07" name="simple-form-phone-07"
                       placeholder="555-555-5555" value={phone} onChange={handlePhoneChange}/>
        </FormGroup>
        <FormGroup label="Contact Person Name" isRequired fieldId="simple-form-phone-08"
                   labelIcon={<Popover
                       headerContent={<div>
                           Contact Person's Name
                       </div>}
                       bodyContent={<div>
                           For any further verifications, emergency matters, contact person will be notified.
                       </div>}
                   >
                       <button type="button" aria-label="More info for name field" onClick={e => e.preventDefault()}
                               aria-describedby="simple-form-name-08" className="pf-c-form__group-label-help">
                           <HelpIcon noVerticalAlign/>
                       </button>
                   </Popover>}
        >
            <TextInput isRequired type="text" id="simple-form-phone-08" name="simple-form-phone-08"
                       value={contactName} onChange={handleContactPersonNameChange}/>
        </FormGroup>
    </Form>;
};