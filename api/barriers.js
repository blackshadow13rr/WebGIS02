import { $get, $post } from "../utils/request";
import { $EleMsgNotifySuccess, $EleMsgNotifyError, $confirm } from "../utils/alert";

export let GetLocation = async () => {
    let results = await $get("epidemicArea/query");
    let locations = [];
    if (results) {
        results.forEach(element => {
            let {latitude, longitude} = element;
            locations.push({
                latitude: latitude,
                longitude: longitude
            })
        });
    }
    return locations;
}