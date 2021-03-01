import {
    React,
    Typography,
} from "../../utility/general-imports";
import styles from "../../pages/SFCardManagement/CardManagement.module.scss";
import {
    ICON_NO_RECORDS,
    NO_RECORDS_FOUND,
    NO_RECORDS_FOUND_DESC,
    NO_RECORDS_FOUND_SUGGESSION
} from "../../pages/SFCardManagement/constants";

const NoRecordsFound = (props:any) => {
    return (
        <div className={"d-flex flex-column"}>
            <div>
                <img src={ICON_NO_RECORDS}></img>
            </div>
            <div>
                <Typography
                    variant="h5"
                    className={styles.noRecords_Primary}
                >
                    { NO_RECORDS_FOUND }
                </Typography>
            </div>
            <div>
                <Typography className={styles.noRecords_Secondary}>
                    { NO_RECORDS_FOUND_DESC }
                </Typography>
            </div>
            <div>
                <Typography className={styles.noRecords_Secondary}>
                    { NO_RECORDS_FOUND_SUGGESSION }
                </Typography>
            </div>
        </div>
    )
}

export default NoRecordsFound