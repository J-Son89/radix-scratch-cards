import { get, isArray } from 'lodash';


const baseURI = "https://stokenet.radixdlt.com"

export const get_internal_vault_address = async (address, resource_address) => {
    if (!address || !resource_address) {
        return ""
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            address,
            resource_address
        })
    };
    const response = await fetch(`${baseURI}/state/entity/page/non-fungible-vaults/`, requestOptions)
    const jsonResponse = await response.json()
    const scratchcard_vault_address = get(jsonResponse, ['items', '0', 'vault_address'])
    return scratchcard_vault_address
}

export const get_users_cards_ids = async (address, resource_address, vault_address) => {
    if (!address || !resource_address || !vault_address) {
        return ""
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            address,
            resource_address,
            vault_address

        })
    };
    const response = await fetch(`${baseURI}/state/entity/page/non-fungible-vault/ids`, requestOptions)
    const jsonResponse = await response.json()
    const users_cards_ids = get(jsonResponse, ['items'])
    return users_cards_ids
}

const processNFTData = (data) => Object.values(data).reduce((acc, cur) => ({
    ...acc,
    [get(cur, 'field_name')]: { ...cur }
}), {})


export const get_users_cards_data = async (resource_address, non_fungible_ids) => {
    if (!resource_address || !non_fungible_ids) {
        return ""
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            resource_address,
            non_fungible_ids

        })
    };
    const response = await fetch(`${baseURI}/state/non-fungible/data`, requestOptions)
    const jsonResponse = await response.json()
    const users_cards_ids = get(jsonResponse, ['non_fungible_ids'])
    console.log(users_cards_ids)
    return users_cards_ids.reduce((acc, cur,) => {
        const data = get(cur, ['data', 'programmatic_json', 'fields'])
        return {
            ...acc,
            [get(cur,['non_fungible_id'])]: processNFTData(data),
        }
    }, {})

}
