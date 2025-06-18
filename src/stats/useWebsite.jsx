import { useAppKitAccount } from "@reown/appkit/react";
import { BACKEND_API } from "@utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";


export const useWebsiteStats = (id) => {
    const { address } = useAppKitAccount();
    const [stats, setStats] = useState({
        website: {},
        header: {},
        hero: {},
        about: {},
        team: {},
        info: {},
        tokenomics: {},
        howToBuy: {},
        dex: {},
        presale: {},
        roadmap: [],
        social: {},
        cta: {},
        footer: {},
        chaininfo: {},
        loading: true,
        error: "",
        presale_address: ""
    });




    useEffect(() => {
        const fetch = async () => {

            try {
                const formData = new FormData();
                formData.append('type', 'get_by_slug');
                formData.append('slug', id);
                formData.append('address', address);

                const response = await axios.post(BACKEND_API, formData);


                if (response.data.success && response.data.data) {
                    const record = response.data.data;

                    const finaldata = {};
                    Object.keys(record).map((items, key) => {
                        try {
                            finaldata[items] = typeof record[items] === 'string'
                                ? JSON.parse(record[items])
                                : record[items];
                        }
                        catch (err) {
                            finaldata[items] = record[items];
                        }

                        return true;
                    })

                    setStats({ ...finaldata, loading: false })
                }
                else {
                    setStats({ ...stats, error: response.data.error, loading: false })
                }
            }
            catch (err) {
                setStats({ ...stats, error: err.message, loading: false })
            }
        }
        if (id) {
            fetch();
        }
        else {
            setStats({
                website: {},
                header: {},
                hero: {},
                about: {},
                team: {},
                info: {},
                tokenomics: {},
                howToBuy: {},
                dex: {},
                presale: {},
                roadmap: [],
                social: {},
                cta: {},
                footer: {},
                chaininfo: {},
                presale_address: "",
                loading: true,
                error: "",
            })
        }
        // eslint-disable-next-line
    }, [id]);

    return stats;
}
