const inputSm = {xs: 6, sm: 6, md: 4, lg: 3, xl: 3};
const inputMd = {xs: 12, sm: 12, md: 6, lg: 4, xl: 4};
const inputLg = {xs: 12, sm: 12, md: 12, lg: 6, xl: 6};
const inputXl = {xs: 12, sm: 12, md: 12, lg: 12, xl: 12};

export function setSize(size){
    if (size === "s") return inputSm;
    if (size === "m") return inputMd;
    if (size === "l") return inputLg;
    return inputXl;
}