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
            }

        } else {

            // //Second player
            rightElemnent = getRightElement($(this));


            if (rightElemnent === "error") {
                alert("Error");
            } else {
                rightElemnent.addClass("active-ai").addClass("active");

                tableData[rightElemnent.attr("data-element")] = "active-ai";


                _TURN_STATUS = "player";
                checkWin("active-ai");
            }
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
        let roadExamples = [];
        let roadBest = [];
        let playerResult;
        let aiResult;
        let weight;
        let _TURN_STATUS_SAVE = $.extend(true, {}, _TURN_STATUS);
        var tableDataSave = JSON.parse(JSON.stringify(tableData));
        // let tableDataSave = tableData;


        let tree = [];

        //Tree with levels
        tree = createTree(tree);

        // console.log(tree);


        // stateScore = Math.min(...newStateScores);

        let obj;
        let el;
        for (obj in tree) {
            el = tree[obj];

            // _TURN_STATUS = _TURN_STATUS_SAVE;

            _TURN_STATUS = $.extend(true, {}, _TURN_STATUS_SAVE);


            // console.log(tableData);

            tableData = JSON.parse(JSON.stringify(tableDataSave));


            // if (el["turn_combination"] == [3, 1, 3]) {
            //     console.log("SEE WIN, please!");
            // }

            el["turn_combination"].forEach(element => {
                //Check win status and set lowest weights

                rightElemnent = getRightElement($("[data-element=" + element + "]"));

                if (rightElemnent === "Error") {
                    // alert(rightElemnent);
                } else {
                    playerResult = false;
                    aiResult = false;

                    // console.log(el["lev"] + " level=" + _TURN_STATUS + " turn - " + element);
                    if (_TURN_STATUS === "player") {
                        tableData[rightElemnent.attr("data-element")] = "active-player";

                        playerResult = checkWin("active-player", "future");
                        // aiResult = checkWin("active-ai", "future");

                        _TURN_STATUS = "ai";
                    } else {
                        tableData[rightElemnent.attr("data-element")] = "active-ai";

                        // playerResult = checkWin("active-player", "future");
                        aiResult = checkWin("active-ai", "future");

                        // if (el["turn_combination"] === [3, 1, 3]) {
                        //     console.log("SEE WIN, please!");
                        // }

                        _TURN_STATUS = "player";
                    }

                    if (aiResult === true) {
                        weight = 1;
                    } else if (playerResult === true) {
                        weight = -1;
                    } else {
                        weight = 0;
                    }
                    // el["weight"] = weight;
                    // ev_2_turn_4_4: {value: 4, weight: -1,
                    // FIX WEIGHT FUTURE WHEN 4 4
                    //В теории бот может поставить на 4 кружок, а потом моя 4 не даст победы, но он думает, что проиграет


                    //TODO lev_3_turn_3_1_3: {value: 3, weight: 0,

                    tree[obj]["weight"] = weight;
                    // console.log(", weight - " + el["weight"]);
                }


                // console.log(el["turn_combination"]);
            });

            // console.log(tree);

        }


        // _TURN_STATUS = _TURN_STATUS_SAVE;
        _TURN_STATUS = $.extend(true, {}, _TURN_STATUS_SAVE);

        tableData = tableDataSave;
        console.log(tableData);
        console.log(tree);


        let weightExamles = [];


        for (obj in tree) {
            el = tree[obj];
//TODO GET THE BEST ROUTE AND WATCH ALSO LEVEL
            if (el["lev"] === 1 && el["weight"] === 1) {
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
        // let i5;
        // let lev;

//need recursive change
        for (i1 = 1; i1 <= _COL_COUNT; i1++) {
            if ($("[data-element=" + i1 + "]").hasClass("active")) {

            } else {

                tree["lev_" + 1 + "_turn_" + i1] = {"value": i1, "weight": null, "turn_combination": [i1], "lev": 1};
                for (i2 = 1; i2 <= _COL_COUNT; i2++) {


                    if ($("[data-element=" + i2 + "]").hasClass("active")) {

                    } else {
                        tree["lev_" + 2 + "_turn_" + i1 + "_" + i2] = {
                            "value": i1,
                            "weight": null,
                            "turn_combination": [i1, i2],
                            "lev": 2
                        };
                    }


                    for (i3 = 1; i3 <= _COL_COUNT; i3++) {
                        if ($("[data-element=" + i3 + "]").hasClass("active")) {

                        } else {
                            tree["lev_" + 3 + "_turn_" + i1 + "_" + i2 + "_" + i3] = {
                                "value": i1,
                                "weight": null,
                                "turn_combination": [i1, i2, i3],
                                "lev": 3
                            };
                        }
                    }


                }
            }
        }

        return tree;

    }
});