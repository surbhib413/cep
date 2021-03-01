import {
    React,
    makeStyles,
    Button,
    ButtonGroup,
    Tabs,
    Tooltip
} from "../../utility/general-imports";
import PropTypes from "prop-types";
import styles from "../SFCardManagement/CardManagement.module.scss";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        padding: "3px",
        backgroundColor: "#dff0fd",
        // height: "40px",
        borderRadius: "2px",
        "& .MuiButtonGroup-root": {
            // width:"100%"
            display: "contents"
        },
        "& .MuiButtonGroup-grouped": {
            minWidth: "125px"
        },
        // overflow: "auto",
        "& > *": {
            margin: "auto",
            width: "100%",
            // height: "30px",
        },
        "& :focus": {
            backgroundColor: "#0369dd",
            outlined: "none",
        },
        "& .MuiButtonGroup-groupedTextPrimary:not(:last-child)": {
            borderColor: "#6e7a93",
        },
        "& .MuiButtonBase-root": {
            padding: "0px 8px",
            height: "2rem"
        }
    },
    scroll: {
        // "& .MuiTabs-scroller":{
        //     // paddingLeft:"1rem"
        // },
        alignItems: "center",
        minHeight: "0px",
        "& .MuiTabs-flexContainer": {
            // display:"block",
            height: "100%",
            // "& .MuiTabs-indicator":{
            //     display:"none"
            // }

        },
        "& .Mui-disabled": {
            // display:"none",
            display: "none !important"
        },
        "& .MuiTabs-scrollButtonsDesktop": {
            display: "flex"
        }

    }

}));

export default function CardManagementTabs(props: any) {
    const classes = useStyles();
    const { cardCountResponse, selectedButton, handleTabButtonClick } = props;
    let { activeCount = 0, inActiveCount = 0, blockedCount = 0, hotlistedCount = 0, terminatedCount = 0, unassignedCount = 0, allCardsCount = 0 } = props;

    cardCountResponse.map((cardCount: any) => {
        switch (cardCount.state) {
            case "Active":
                activeCount = cardCount.count;
                break;
            case "Inactive":
                inActiveCount = cardCount.count;
                break;
            case "Blocked":
                blockedCount = cardCount.count;
                break;
            case "Hotlisted":
                hotlistedCount = cardCount.count;
                break;
            case "Terminated":
                terminatedCount = cardCount.count;
                break;
            case "Unassigned":
                unassignedCount = cardCount.count;
                break;
            case "All":
                allCardsCount = cardCount.count;
                break;
        }
    });

    return (
        <div className={classes.root}>
            <Tabs className={classes.scroll} variant="scrollable" scrollButtons="auto">
                <ButtonGroup
                    variant="text"
                    aria-label="text primary button group"
                >
                    <Button
                        // className={styles.buttonWidthCardManagement}
                        className={`${styles.buttonWidthCardManagement} ${selectedButton == "Active"
                            && styles.labelPrimarySelected}`
                        }

                        onClick={() => handleTabButtonClick("Active")}
                    >
                        <div>
                            <span

                                className={styles.labelPrimary}
                            >
                                Active
            </span>
                            <span className={styles.labelSecondaryActive}>{activeCount}</span>
                        </div>
                    </Button>
                    <Button
                        className={`${styles.buttonWidthCardManagementLarge} ${selectedButton == "Unassigned" && styles.labelPrimarySelected}`}

                        onClick={() => handleTabButtonClick("Unassigned")}
                    >
                        <div>
                            <span
                                className={styles.labelPrimary}
                            >
                                Unassigned
                        </span>
                            <span className={styles.labelSecondaryUnassigned}>
                                {unassignedCount}
                            </span>
                        </div>
                    </Button>
                    <Button
                        className={`${styles.buttonWidthCardManagementLarge} ${selectedButton == "Inactive" && styles.labelPrimarySelected}`}

                        onClick={() => handleTabButtonClick("Inactive")}
                    >
                        <div>
                            <span
                                className={styles.labelPrimary}
                            >
                                Inactive
            </span>
                            <span className={styles.labelSecondaryInActive}>
                                {inActiveCount}
                            </span>
                        </div>
                    </Button>
                    <Button
                        className={`${styles.buttonWidthCardManagementLarge} ${selectedButton == "Blocked" && styles.labelPrimarySelected}`}

                        onClick={() => handleTabButtonClick("Blocked")}
                    >
                        <div>
                            <span
                                className={styles.labelPrimary
                                }
                            >
                                Blocked
                        </span>
                            <span className={styles.labelSecondaryBlocked}>{blockedCount}</span>
                        </div>
                    </Button>
                    <Button
                        className={`${styles.buttonWidthCardManagementLarge} ${selectedButton == "Hotlisted" && styles.labelPrimarySelected}`}

                        onClick={() => handleTabButtonClick("Hotlisted")}
                    >
                        <div>
                            <span
                                className={styles.labelPrimary
                                }
                            >
                                Hotlisted
                        </span>
                            <span className={styles.labelSecondaryHotlisted}>
                                {hotlistedCount}
                            </span>
                        </div>
                    </Button>
                    <Button
                        className={`${styles.buttonWidthCardManagementLarge} ${selectedButton == "Terminated" && styles.labelPrimarySelected}`}

                        onClick={() => handleTabButtonClick("Terminated")}
                    >
                        <div>
                            <span
                                className={styles.labelPrimary
                                }
                            >
                                Terminated
                        </span>
                            <span className={styles.labelSecondaryTerminated}>
                                {terminatedCount}
                            </span>
                        </div>
                    </Button>
                    <Button
                        className={`${styles.buttonWidthCardManagementLarge} ${selectedButton == "All" && styles.labelPrimarySelected}`}

                        onClick={() => handleTabButtonClick("All")}
                    >
                        <div>
                            <span
                                className={styles.labelPrimary
                                }
                            >
                                All
                        </span>
                            <span className={styles.labelSecondaryAll}>{allCardsCount}</span>
                        </div>
                    </Button>
                </ButtonGroup>
            </Tabs>
        </div>
    );
}
