import { 
  SET_CARDS_FOR_BULK_ACTION,
  SET_POPUP_TITLE_FOR_BULK_ACTION,
  SET_POPUP_DESCRIPTION_FOR_BULK_ACTION,
  SET_POPUP_ACTION_TYPE_FOR_BULK_ACTION, 
} from "../../types/types";
  
  const initialState = {
     selectedFleetCardsForBulkAction: '',
     title: '',
     description: '',
     actionType: ''
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_CARDS_FOR_BULK_ACTION:  
        return {
          ...state,
          selectedFleetCardsForBulkAction: action.fleetCardIds
        };
      case SET_POPUP_TITLE_FOR_BULK_ACTION:  
        return {
          ...state,
          title: action.title
        };
  
      case SET_POPUP_DESCRIPTION_FOR_BULK_ACTION:  
        return {
          ...state,
          description: action.description,
  
        };
  
      case SET_POPUP_ACTION_TYPE_FOR_BULK_ACTION:
          return{
            ...state,
            actionType: action.actionType,
          };  
      default:
        return state;
    }
  };
  
  // export default reducer;
  export default reducer 