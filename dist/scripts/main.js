$(document).ready(function () {

    let _TURN_STATUS = "player";
    // var _TURN_STATUS = "ai";

    const _ROW_COUNT = 6;
    const _COL_COUNT = 7;

    const _MINIMAX_DEPTH = 4;

    let rightElemnent;

    var winExamples = [];

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
                if ($("[data-element=" + element + "]").hasClass(playerOrAIName)) {
                    roundsInRow++;
                    // console.log(winCombination);
                    // console.log(roundsInRow);
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
            checkWin("active-ai");
        }
    }

    function minimaxChoose() {
        let roadExamples = [];
        let roadBest = [];
        let playerResult;
        let aiResult;
        let weights;

        //todo minimax
        //_MINIMAX_DEPTH
        // for (i = 1; i <= _COL_COUNT; i++) {
        //     rightElemnent = getRightElement($("[data-element=" + i + "]"));
        //     rightElemnent.addClass("active-ai").addClass("active").addClass("think");
        //     _TURN_STATUS = "player";
        //

        //Begin from end
        // aiResult = checkWin("active-ai", "future");
        // playerResult = checkWin("active-player", "future");
        //
        // if (aiResult === true) {
        //     weights = 1;
        // } else if (playerResult === true) {
        //     weights = -1;
        // } else {
        //     weights = 0;
        // }

        // for (i = 1; i <= _COL_COUNT; i++) {
        //     for (i = 1; i <= _COL_COUNT; i++) {
        //         for (i = 1; i <= _COL_COUNT; i++) {
        //
        //         }
        //     }
        // }

        //     $(".think").removeClass("active-player").removeClass("active-ai").removeClass("active").removeClass("think");
        // }
        //


        let tree = [];

        let i;
        let o;
        let p;
        let a;

        //Tree with levels
        for (i = 1; i <= _COL_COUNT; i++) {
            console.log(i);
            tree["level_1_turn_" + i] = {"value": i, "next_level": []};

            var arrayLevel2 = [];
            for (o = 1; o <= _COL_COUNT; o++) {
                arrayLevel2["level_2_turn_" + o] = {"value": o, "next_level": []};


                var arrayLevel3 = [];
                for (p = 1; p <= _COL_COUNT; p++) {
                    arrayLevel3["level_3_turn_" + p] = {"value": p, "next_level": []};


                    var arrayLevel4 = [];
                    for (a = 1; a <= _COL_COUNT; a++) {
                        arrayLevel4["level_4_turn_" + a] = {"value": a, "next_level": []};
                    }
                    arrayLevel3["level_3_turn_" + p]["next_level"] = arrayLevel4;


                }
                arrayLevel2["level_2_turn_" + o]["next_level"] = arrayLevel3;

            }
            tree["level_1_turn_" + i]["next_level"] = arrayLevel2;
        }

        console.log(tree);


        //TODO Проверит результа снизу раставляя весы и пропускать варианты в Error

        // $(".think").removeClass("active-player").removeClass("active-ai").removeClass("active").removeClass("think");
        return getRandomInt(7) + 1;
    }
});