import React from 'react'
import SFCardManagement from '../../src/pages/SFCardManagement';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Cookies from "universal-cookie";
import { callDropdownList } from "../../src/lib/api/common";
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const cookies = new Cookies(context.req.headers.cookie);
    const queryData = {
        cookieData: {
            mark_one: cookies.get("mark_one"),
            mark_two: cookies.get("mark_two"),
            mark_three: cookies.get("mark_three"),
        },
        state: 'active',
        code: "VehicleType, VehicleMake,FuelType,CardName,CardType",
    };
    //const res = await getCardStatusCount(queryData);
    //const countData = await res.data;
    // Pass data to the page via props
    const dropdownListsQueryData = await callDropdownList(queryData);
    const dropdownLists = dropdownListsQueryData?.data ?  dropdownListsQueryData?.data : []

    return { props: { countData: [] ,dropdownLists: dropdownLists }}
}

function index(props: any) {
    return <SFCardManagement {...props} />
}

export default index