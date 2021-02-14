$(document).ready(function () {
    let _TURN_STATUS = "player";
    // var _TURN_STATUS = "ai";

    const _ROW_COUNT = 6;
    const _COL_COUNT = 7;

    const _MINIMAX_DEPTH = 4;
    // const _MINIMAX_DEPTH = 5;

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

        $(".element").each(function (index) {
            tableData[index + 1] = "empty";
        });
    });

    $("[data-restart-game-first-ai]").click(function () {
        alert("Game restarted. First AI step!");
        _TURN_STATUS = "ai";

        $(".active").removeClass("active-player").removeClass("active-ai").removeClass("active");

        $(".element").each(function (index) {
            tableData[index + 1] = "empty";
        });

        aiTurn();
    });

    //Check win
    function checkWin(playerOrAIName, type) {
        let roundsInRow = 0;
        let winStatus = false;

        winExamples.forEach((winCombination) => {
            winCombination.forEach((element) => {
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
            let playerOrAIRounds = $("." + playerOrAIName);
            if (playerOrAIRounds.first().hasClass("active-player")) {
                alert("Player win!");
            } else if (playerOrAIRounds.first().hasClass("active-ai")) {
                alert("AI win!");
            }
            $(".element").addClass("active");
        }

        return winStatus;
    }

    //Give element which shall be activated after click
    function getRightElement(clickedElement) {
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
                return previousElement;
            }
        }

        return "Error";
    }

    //Give element number(id) which shall be activated after click
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

    //Player click
    $(".element").click(function () {
        //CHECK GAME END
        let i;
        let drawStatus = true;
        for (i = 1; i <= _COL_COUNT; i++) {
            if (tableData[i] === "empty") {
                drawStatus = false;
            }
        }

        if (drawStatus) {
            return;
        }

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

    //AI turn
    function aiTurn() {
        //CHECK GAME END
        let i;
        let drawStatus = true;
        for (i = 1; i <= _COL_COUNT; i++) {
            if (tableData[i] === "empty") {
                drawStatus = false;
            }
        }

        if (drawStatus) {
            return;
        }

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

    //Minimax algoritmm
    function minimaxChoose() {
        console.log("Turn status on start " + _TURN_STATUS);

        let tree = [];

        //Tree with levels
        tree = createTree(tree);

        let obj;
        let el;

        let best_move = 0;

        console.log(tableData);
        console.log(tree);

        let i;
        for (i = (_MINIMAX_DEPTH - 1); i >= 1; i--) {
            setTreeWeight(i, tree);
        }

        console.log(tree);

        for (obj in tree) {
            el = tree[obj];

            if (el["lev"] === 1 && el["weight"] === 1) {
                best_move = el["turn_combination"][0];
            }
        }

        //Search 0 result
        if (best_move === 0) {
            for (obj in tree) {

                let weightList = [];

                el = tree[obj];

                if (el["lev"] === 1 && el["weight"] === 0) {
                    best_move = el["turn_combination"][0];
                }
            }
        }

        //Search -1 result
        if (best_move === 0) {
            for (obj in tree) {

                let weightList = [];

                el = tree[obj];

                if (el["lev"] === 1 && el["weight"] === -1) {
                    best_move = el["turn_combination"][0];
                }
            }
        }

        return best_move;

    }

    //Create tree
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
            if (tableData[i1] === "empty") {
                weight = 0;
                turn_combination = [i1];
                weight = getWeight(turn_combination);

                // tree["lev_" + 1 + "_turn_" + i1] = {
                tree["turn_" + i1] = {
                    "weight": weight,
                    "turn_combination": turn_combination,
                    "lev": 1
                };

                if (weight === 0) {
                    for (i2 = 1; i2 <= _COL_COUNT; i2++) {
                        if (tableData[i2] === "empty") {
                            weight = 0;
                            turn_combination = [i1, i2];
                            weight = getWeight(turn_combination);

                            // tree["lev_" + 2 + "_turn_" + i1 + "_" + i2] = {
                            tree["turn_" + i1 + "_" + i2] = {
                                "weight": weight,
                                "turn_combination": turn_combination,
                                "lev": 2
                            };

                            if (weight === 0) {
                                for (i3 = 1; i3 <= _COL_COUNT; i3++) {
                                    if (tableData[i3] === "empty") {
                                        weight = 0;
                                        turn_combination = [i1, i2, i3];
                                        weight = getWeight(turn_combination);

                                        // tree["lev_" + 3 + "_turn_" + i1 + "_" + i2 + "_" + i3] = {
                                        tree["turn_" + i1 + "_" + i2 + "_" + i3] = {
                                            "weight": weight,
                                            "turn_combination": turn_combination,
                                            "lev": 3
                                        };

                                        if (weight === 0) {
                                            for (i4 = 1; i4 <= _COL_COUNT; i4++) {
                                                if (tableData[i4] === "empty") {
                                                    weight = 0;
                                                    turn_combination = [i1, i2, i3, i4];
                                                    weight = getWeight(turn_combination);

                                                    // tree["lev_" + 4 + "_turn_" + i1 + "_" + i2 + "_" + i3 + "_" + i4] = {
                                                    tree["turn_" + i1 + "_" + i2 + "_" + i3 + "_" + i4] = {
                                                        "weight": weight,
                                                        "turn_combination": turn_combination,
                                                        "lev": 4
                                                    };

                                                    // if (weight === 0) {
                                                    //     for (i5 = 1; i5 <= _COL_COUNT; i5++) {
                                                    //         if (tableData[i5] === "empty") {
                                                    //             weight = 0;
                                                    //             turn_combination = [i1, i2, i3, i4, i5];
                                                    //             weight = getWeight(turn_combination);
                                                    //
                                                    //             // tree["lev_" + 4 + "_turn_" + i1 + "_" + i2 + "_" + i3 + "_" + i4] = {
                                                    //             tree["turn_" + i1 + "_" + i2 + "_" + i3 + "_" + i4 + "_" + i5] = {
                                                    //                 "weight": weight,
                                                    //                 "turn_combination": turn_combination,
                                                    //                 "lev": 5
                                                    //             };
                                                    //         }
                                                    //     }
                                                    // }

                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return tree;

    }

    //Check win status
    function getWeight(turn_combination) {
        let _TURN_STATUS_SAVE = _TURN_STATUS;
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

        _TURN_STATUS = _TURN_STATUS_SAVE;

        tableData = tableDataSave;

        return weight;
    }

    //Hierarchical weight set
    function setTreeWeight(level, tree) {
        let obj;
        let el;
        let i;

        for (obj in tree) {

            let weightList = [];

            el = tree[obj];

            if (el["lev"] === level && el["weight"] === 0) {
                for (i = 1; i <= _COL_COUNT; i++) {
                    if (tableData[i] === "active-ai" || tableData[i] === "active-player" || tableData[i] === undefined) {
                        //Do nothing
                    } else {
                        weightList.push(tree[obj + "_" + i]["weight"]);
                    }
                }

                if (weightList !== []) {
                    if (level % 2) {
                        //For 1 and 3 level
                        tree[obj]["weight"] = getMinOfArray(weightList);
                    } else {
                        tree[obj]["weight"] = getMaxOfArray(weightList);
                    }
                }
            }
        }

        return tree;
    }

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    function getMinOfArray(numArray) {
        return Math.min.apply(null, numArray);
    }
});