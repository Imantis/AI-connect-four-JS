//TODO FIX - ON AI RESTART - PLAYER WIN(Datatable)

$(document).ready(function () {

    let _TURN_STATUS = "player";
    // var _TURN_STATUS = "ai";

    const _ROW_COUNT = 6;
    const _COL_COUNT = 7;

    const _MINIMAX_DEPTH = 4;

    let rightElemnent;

    var winExamples = [];

    var tableData = [];

    function winCombinationSearch() {
        //Win in row
        let i;
        let lev;
        for (i = 0; i < _ROW_COUNT; i++) {
            lev = i * _COL_COUNT;
            winExamples.push([lev + 1, lev + 2, lev + 3, lev + 4]);
            winExamples.push([lev + 2, lev + 3, lev + 4, lev + 5]);
            winExamples.push([lev + 3, lev + 4, lev + 5, lev + 6]);
            winExamples.push([lev + 4, lev + 5, lev + 6, lev + 7]);
        }

        // //Win in column
        for (i = 1; i <= _COL_COUNT; i++) {
            lev = i;

            winExamples.push([lev, lev + (_COL_COUNT), lev + (_COL_COUNT * 2), lev + (_COL_COUNT * 3)]);
            winExamples.push([lev + (_COL_COUNT), lev + (_COL_COUNT * 2), lev + (_COL_COUNT * 3), lev + (_COL_COUNT * 4)]);
            winExamples.push([lev + (_COL_COUNT * 2), lev + (_COL_COUNT * 3), lev + (_COL_COUNT * 4), lev + (_COL_COUNT * 5)]);
        }

        //Win in diagonal from left top to right bottom
        for (i = 1; i <= _COL_COUNT - 3; i++) {
            lev = i;

            winExamples.push([lev, lev + (_COL_COUNT + 1), lev + (_COL_COUNT * 2 + 2), lev + (_COL_COUNT * 3 + 3)]);
            winExamples.push([lev + (_COL_COUNT), lev + (_COL_COUNT * 2 + 1), lev + (_COL_COUNT * 3 + 2), lev + (_COL_COUNT * 4 + 3)]);

            // if (!((lev + (_COL_COUNT * 5 + 3)) >= 43)) {
            winExamples.push([lev + (_COL_COUNT * 2), lev + (_COL_COUNT * 3 + 1), lev + (_COL_COUNT * 4 + 2), lev + (_COL_COUNT * 5 + 3)]);
            // }
        }

        //Win in diagonal from left bottom to right top
        for (i = 4; i <= _COL_COUNT; i++) {
            lev = i;

            winExamples.push([lev, lev + (_COL_COUNT - 1), lev + (_COL_COUNT * 2 - 2), lev + (_COL_COUNT * 3 - 3)]);
            winExamples.push([lev + (_COL_COUNT), lev + (_COL_COUNT * 2 - 1), lev + (_COL_COUNT * 3 - 2), lev + (_COL_COUNT * 4 - 3)]);

            winExamples.push([lev + (_COL_COUNT * 2), lev + (_COL_COUNT * 3 - 1), lev + (_COL_COUNT * 4 - 2), lev + (_COL_COUNT * 5 - 3)]);
        }


        console.log(winExamples);
    }

    winCombinationSearch();

    $(".element").each(function (index) {
        $(this).attr("data-element", index + 1);
        $(this).append(index + 1);

        //Status - empty - active-ai - active-player
        tableData[index + 1] = "empty";
    });

    $("[data-restart-game-first-player]").click(function () {
        alert("Game restarted. First player step!");
        _TURN_STATUS = "player";

        $(".active").removeClass("active-player").removeClass("active-ai").removeClass("active");
    });

    $("[data-restart-game-first-ai]").click(function () {
        alert("Game restarted. First AI step!");
        _TURN_STATUS = "ai";

        $(".active").removeClass("active-player").removeClass("active-ai").removeClass("active");

        aiTurn();
    });

    function checkWin(playerOrAIName, type) {
        let roundsInRow = 0;
        let winStatus = false;
        let playerOrAIRounds = $("." + playerOrAIName);

        winExamples.forEach((winCombination) => {
            winCombination.forEach((element) => {

                // if ($("[data-element=" + element + "]").hasClass(playerOrAIName)) {
                if (tableData[element] === playerOrAIName) {
                    roundsInRow++;
                } else {
                    roundsInRow = 0;
                    return null;
                }
            });

            if (roundsInRow >= 4) {
                winStatus = true;
                return null;
            }
        });

        if (winStatus && type !== "future") {
            if (playerOrAIRounds.first().hasClass("active-player")) {
                alert("Player win!");
            } else if (playerOrAIRounds.first().hasClass("active-ai")) {
                alert("AI win!");
            }

            $(".element").addClass("active");
        }

        return winStatus;


    }

    function getRightElement(clickedElement) {
        // console.log(clickedElement.data("element"));

        let id = clickedElement.data("element");
        let currentElement = clickedElement;
        let previousElement;


        if (id >= _ROW_COUNT * _COL_COUNT - _ROW_COUNT) {
            return currentElement;
        }


        while (id <= _COL_COUNT * _ROW_COUNT) {
            id = id + _COL_COUNT;
            previousElement = currentElement;

            currentElement = $("[data-element=" + id + "]");
            if (!currentElement.length || currentElement.hasClass("active")) {
                // console.log("This ID dont exist or active - " + id);
                return previousElement;
            }
        }

        return "Error";
    }

    function getRightElementNumber(clickedElementId) {
        let currentElementID = clickedElementId;
        let previousElementID;


        if (currentElementID >= _ROW_COUNT * _COL_COUNT - _ROW_COUNT) {
            return currentElementID;
        }


        while (currentElementID <= _COL_COUNT * _ROW_COUNT) {
            previousElementID = currentElementID;
            currentElementID = currentElementID + _COL_COUNT;


            if (tableData[currentElementID] === "active-ai" || tableData[currentElementID] === "active-player" || tableData[currentElementID] === undefined) {
                // console.log("getRightElementNumber - " + previousElementID);
                return previousElementID;
            }
        }

        return "Error";
    }

    $(".element").click(function () {
        if ($(this).hasClass("active")) {
            return;
        }
        let winStatus = false;

        if (_TURN_STATUS === "player") {
            rightElemnent = getRightElement($(this));

            if (rightElemnent === "Error") {
                alert(rightElemnent);
            } else {
                rightElemnent.addClass("active-player").addClass("active");

                tableData[rightElemnent.attr("data-element")] = "active-player";


                _TURN_STATUS = "ai";
                winStatus = checkWin("active-player");
            }

            if (!winStatus) {
                aiTurn();
                // setTimeout(() => {
                //     aiTurn();
                // }, 1);
                // let turn_combination = [3, 1, 3, 7, 3, 2, 3];
                //
                // console.log(turn_combination);
                //
                // console.log(getWeight(turn_combination));
                // console.log(getRightElementNumber(22));
            }

        } else {

            // //Second player
            // rightElemnent = getRightElement($(this));
            //
            //
            // if (rightElemnent === "error") {
            //     alert("Error");
            // } else {
            //     rightElemnent.addClass("active-ai").addClass("active");
            //
            //     tableData[rightElemnent.attr("data-element")] = "active-ai";
            //
            //
            //     _TURN_STATUS = "player";
            //     checkWin("active-ai");
            // }
        }
    });

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function aiTurn() {
        let click_choose = minimaxChoose();

        rightElemnent = getRightElement($("[data-element=" + click_choose + "]"));

        if (rightElemnent === "Error") {
            alert(rightElemnent);
        } else {
            rightElemnent.addClass("active-ai").addClass("active");
            _TURN_STATUS = "player";

            tableData[rightElemnent.attr("data-element")] = "active-ai";

            checkWin("active-ai");
        }
    }

    function minimaxChoose() {
        console.log("Turn status on start " + _TURN_STATUS);
        let roadBest = [];
        // let tableDataSave = tableData;


        let tree = [];

        //Tree with levels
        tree = createTree(tree);

        let obj;
        let el;
        // console.log(tree);


        // stateScore = Math.min(...newStateScores);


        // _TURN_STATUS = _TURN_STATUS_SAVE;
        // _TURN_STATUS = $.extend(true, {}, _TURN_STATUS_SAVE);

        // tableData = tableDataSave;
        // _TURN_STATUS = _TURN_STATUS_SAVE;
        console.log(tableData);
        console.log(tree);

        //
        // let weightExamles = [];


        for (obj in tree) {
            el = tree[obj];
//TODO GET THE BEST ROUTE AND WATCH ALSO LEVEL
            if (el["lev"] === 1 && el["weight"] === 1) {
                roadBest = el["turn_combination"];
                break;
            }

            if (el["lev"] === 1 && el["weight"] === 0) {
                roadBest = el["turn_combination"];
                break;
            }

            if (el["lev"] === 2 && el["weight"] === 1) {
                roadBest = el["turn_combination"];
                break;
            }

            if (el["lev"] === 2 && el["weight"] === 0) {
                roadBest = el["turn_combination"];
                break;
            }

            if (el["lev"] === 3 && el["weight"] === 1) {
                roadBest = el["turn_combination"];
                break;
            }

            if (el["lev"] === 3 && el["weight"] === 0) {
                roadBest = el["turn_combination"];
                break;
            }
        }


        if (roadBest[0]) {
            console.log("AI MOVE!");
            return roadBest[0];
        } else {
            // return getRandomInt(7) + 1;
            return 3;
        }

    }

    function createTree(tree) {
        let i1;
        let i2;
        let i3;
        let i4;
        let i5;
        let weight;
        let turn_combination;

//need recursive change
        for (i1 = 1; i1 <= _COL_COUNT; i1++) {
            if ($("[data-element=" + i1 + "]").hasClass("active")) {

            } else {
                turn_combination = [i1];
                weight = getWeight(turn_combination);

                tree["lev_" + 1 + "_turn_" + i1] = {
                    // "value": i1,
                    "weight": weight,
                    "turn_combination": turn_combination,
                    "lev": 1
                };
                for (i2 = 1; i2 <= _COL_COUNT; i2++) {


                    if ($("[data-element=" + i2 + "]").hasClass("active")) {

                    } else {
                        turn_combination = [i1, i2];
                        weight = getWeight(turn_combination);

                        tree["lev_" + 2 + "_turn_" + i1 + "_" + i2] = {
                            // "value": i1,
                            "weight": weight,
                            "turn_combination": turn_combination,
                            "lev": 2
                        };
                    }


                    for (i3 = 1; i3 <= _COL_COUNT; i3++) {
                        if ($("[data-element=" + i3 + "]").hasClass("active")) {

                        } else {

                            turn_combination = [i1, i2, i3];
                            weight = getWeight(turn_combination);


                            tree["lev_" + 3 + "_turn_" + i1 + "_" + i2 + "_" + i3] = {
                                // "value": i1,
                                "weight": weight,
                                "turn_combination": turn_combination,
                                "lev": 3
                            };
                        }


                        for (i4 = 1; i4 <= _COL_COUNT; i4++) {
                            if ($("[data-element=" + i4 + "]").hasClass("active")) {

                            } else {

                                turn_combination = [i1, i2, i3, i4];
                                weight = getWeight(turn_combination);


                                tree["lev_" + 4 + "_turn_" + i1 + "_" + i2 + "_" + i3 + "_" + i4] = {
                                    // "value": i1,
                                    "weight": weight,
                                    "turn_combination": turn_combination,
                                    "lev": 4
                                };
                            }


                            // for (i5 = 1; i4 <= _COL_COUNT; i5++) {
                            //     if ($("[data-element=" + i5 + "]").hasClass("active")) {
                            //
                            //     } else {
                            //
                            //         turn_combination = [i1, i2, i3, i4, i5];
                            //         weight = getWeight(turn_combination);
                            //
                            //
                            //         tree["lev_" + 5 + "_turn_" + i1 + "_" + i2 + "_" + i3 + "_" + i4 + "_" + i5] = {
                            //             // "value": i1,
                            //             "weight": weight,
                            //             "turn_combination": turn_combination,
                            //             "lev": 5
                            //         };
                            //     }
                            // }


                        }

                    }


                }
            }
        }

        return tree;

    }

    function getWeight(turn_combination) {

        let _TURN_STATUS_SAVE = $.extend(true, {}, _TURN_STATUS);
        let tableDataSave = JSON.parse(JSON.stringify(tableData));

        let playerResult;
        let aiResult;
        let weight = 0;


        turn_combination.forEach(element => {

            rightElemnent = getRightElementNumber(element);
            // console.log(rightElemnent);

            if (rightElemnent === "Error") {
                // alert(rightElemnent);
            } else {
                playerResult = false;
                aiResult = false;

                // console.log(el["lev"] + " level=" + _TURN_STATUS + " turn - " + element);
                if (_TURN_STATUS === "player") {
                    tableData[rightElemnent] = "active-player";

                    playerResult = checkWin("active-player", "future");

                    _TURN_STATUS = "ai";
                } else {
                    tableData[rightElemnent] = "active-ai";

                    aiResult = checkWin("active-ai", "future");

                    _TURN_STATUS = "player";
                }

                if (aiResult === true) {
                    weight = 1;
                } else if (playerResult === true) {
                    weight = -1;
                } else {
                    weight = 0;
                }
            }
        });

        // console.log(tableData);


        _TURN_STATUS = $.extend(true, {}, _TURN_STATUS_SAVE);

        tableData = tableDataSave;

        return weight;
    }
});