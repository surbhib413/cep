export const getNonTopFilter = (initialData : any, value : string) => {
    let selectedFilter;
    if(initialData.amenities) {
        initialData.amenities.map((item : any) => {
            if(item.displayName === value) {
                selectedFilter = {
                    code: "amenities-" + item.code, 
                    displayName: value 
                }
            }
        }) 
    }

    if(!selectedFilter && initialData.fuelStationCategory) {
        initialData.fuelStationCategory.map((item : any) => {
            if(item.displayName === value) {
                selectedFilter = {
                    code: "fuelStationCategory-" + item.code, 
                    displayName: value 
                }
            }
        })
    }

    if(!selectedFilter && initialData.fuelType) {
        initialData.fuelType.map((item : any) => {
            if(item.displayName === value) {
                selectedFilter = {
                    code: "fuelType-" + item.code, 
                    displayName: value 
                }
            }
        })
    }

    if(!selectedFilter && initialData.lessAmenities) {
        initialData.fuelType.map((item : any) => {
            if(item.displayName === value) {
                selectedFilter = {
                    code: "lessAmenities-" + item.code, 
                    displayName: value 
                }
            }
        })
    }
    
    return selectedFilter;
}

export const getTopFilter = (initialData : any, value : string) => {
    let selectedFilter;
    if(initialData.topFilter) {
        initialData.topFilter.map((item : any) => {
            if(item.displayName === value) {
                selectedFilter = {
                    code: "topFilter-" + item.code, 
                    displayName: value 
                }
            }
        }) 
    }

    return selectedFilter;
}
