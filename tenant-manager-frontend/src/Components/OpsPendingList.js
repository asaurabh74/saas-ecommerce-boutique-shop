import React, {useEffect} from 'react';
import {TableComposable, Tbody, Td, Thead, Tr} from "@patternfly/react-table";
import axios from "../axios-middleware";

export const OpsPendingList = () => {
    const [pendingData, setPendingData] = React.useState([]);

    useEffect(() => {
        getPendingData()
    }, [])

    const getPendingData = () => {
        axios
            .get("/getPendingRequests")
            .then((res) => {
                const receivedData = []

                setPendingData(receivedData)
            })
            .catch((err) => {
                console.error(JSON.stringify(err))
            })
    }
    return <React.Fragment>
        <TableComposable aria-label="Simple table">
            <Thead>
                <Tr key="0">
                    <Td modifier="wrap">Tenant ID</Td>
                    <Td modifier="wrap">Tenant Name</Td>
                    <Td modifier="wrap">Current Tier</Td>
                    <Td modifier="wrap">Requesting Tier</Td>
                    <Td modifier="wrap">Service Name</Td>
                    <Td modifier="wrap">Prev. Min Instances</Td>
                    <Td modifier="wrap">Prev. Max Instances</Td>
                    <Td modifier="wrap">New Min Instances</Td>
                    <Td modifier="wrap">New Max Instances</Td>
                    <Td modifier="wrap">Action</Td>
                </Tr>
            </Thead>
            <Tbody>
                <Tr key="1">
                    <Td>0110000</Td>
                    <Td>Citi Bank</Td>
                    <Td>Silver</Td>
                    <Td>Gold</Td>
                </Tr>
                <Tr key="2">
                    <Td>0110230</Td>
                    <Td>Deutsche Bank</Td>
                    <Td>Free</Td>
                    <Td>Silver</Td>
                </Tr>
            </Tbody>
        </TableComposable>

    </React.Fragment>;

};