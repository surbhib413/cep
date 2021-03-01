import {
  SET_CARDS_FOR_BULK_ACTION,
  SET_POPUP_TITLE_FOR_BULK_ACTION,
  SET_POPUP_DESCRIPTION_FOR_BULK_ACTION,
  SET_POPUP_ACTION_TYPE_FOR_BULK_ACTION
} from "../../types/types"

export const setCardsForBulkAction = (fleetCardIds) => {
    return {
      type: SET_CARDS_FOR_BULK_ACTION,
      fleetCardIds
    }
}

export const setPopupTitleForBulkAction = (title) => {
  return {
    type: SET_POPUP_TITLE_FOR_BULK_ACTION,
    title
  }
}

export const setPopupDescriptionForBulkAction = (description) => {
  return {
    type: SET_POPUP_DESCRIPTION_FOR_BULK_ACTION,
    description
  }
}

export const setPopupActionTypeForBulkAction = (actionType) => {
  return {
    type: SET_POPUP_ACTION_TYPE_FOR_BULK_ACTION,
    actionType
  }
}