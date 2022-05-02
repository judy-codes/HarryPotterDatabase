let qResult = null;

//create the tables and populate it with the data 
function tabform1(dbres) {
    let tbl = '<table border="1" class="search_results">';
    let keyss = ["Character", "Place", "Dialogue"]
    tbl += "<tr>";
    for (let k of keyss) {
        tbl += "<th><button onclick='doReSort(\"" + k + "\")'>" + k + "</button></th>"
    }
    tbl += "</tr>";

    let quotes = Object.keys(dbres);

    for (let q of quotes) {
        tbl += "<tr class=\"item\">";
        if (q != "Movie Chapter") {
            let charInfo = "Gender: " + dbres[q]["Character"]["Gender"] + "\nHouse: " + dbres[q]["Character"]["House"] + "\nPatronus: " + dbres[q]["Character"]["Patronus"] + "\nWand wood: " + dbres[q]["Character"]["Wand (Wood)"] + "\nWand core: " + dbres[q]["Character"]["Wand (Core)"];
            tbl += "<td class=\"CellWithComment\"> " + dbres[q]["Character"]['Character Name'] + " <span class=\"CellComment\">" + charInfo + "</span> </td>";
            let placeInfo = "Place Category: " + dbres[q]["Place"]["Place Category"];
            tbl += "<td class=\"CellWithComment\"> " + dbres[q]["Place"]["Place Name"] + " <span class=\"CellComment\">" + placeInfo + "</span> </td>";
            tbl += "<td class=\"CellWithComment\"> " + q + "</td>";
        }
        tbl += "</tr>";
    }
    tbl += "</table>";
    return tbl;
}

/**
 * Sort the retrieved data by the given key. 
 * Then reformat it into a table.
 * @param {} field the field on which to sort.
 */
function doReSort(field) {
    if (field == "Dialogue") {
        qResult = Object.keys(qResult).sort().reduce(
            (obj, key) => {
                obj[key] = qResult[key];
                return obj;
            },
            {}
        );
        console.log(qResult)
        document.querySelector("#gt2").innerHTML = tabform1(qResult);
    } else if (field == "Place") {
        var items = Object.keys(qResult).map(function (key) {
            return [key, qResult[key]["Place"]["Place Name"]];
        });
        items.sort(function (first, second) {
            if (first[1] < second[1]) {
                return -1;
            }
            if (first[1] > second[1]) {
                return 1;
            }
            return 0;
        });

        var finSorted ={}
        for(var i = 0; i < items.length; i ++){
            console.log(items[i][0] + qResult[items[i][0]])
            finSorted[items[i][0]] = qResult[items[i][0] ]
        }
        qResult = finSorted
        document.querySelector("#gt2").innerHTML = tabform1(qResult);
    }else{
        var items = Object.keys(qResult).map(function (key) {
            return [key, qResult[key]["Character"]["Character Name"]];
        });

        items = items.sort(function (first, second) {
            if (first[1] < second[1]) {
                return -1;
            }
            if (first[1] > second[1]) {
                return 1;
            }
            return 0;
        });

        var finSorted ={}
        for(var i = 0; i < items.length; i ++){
            finSorted[items[i][0]] = qResult[items[i][0]]
        }
        qResult = finSorted
        document.querySelector("#gt2").innerHTML = tabform1(qResult);
    }
}

//populate the chapter dropdown by doing a query 
function formChapter(movieObject, chapterObject) {
    var movie = document.getElementById(movieObject);
    var chapter = document.getElementById(chapterObject);
    chapter.innerHTML = "";
    let params = {
        method: "POST"
    }
    let uurl = "http://165.106.10.170:9999/mongoChapter"
    params['body'] = JSON.stringify({ movie: movie.value });

    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                qResult = JSON.parse(text);
                keys = Object.keys(qResult);
                dontWant = ['Movie ID', 'Release Year', 'Runtime', 'Budget', 'Box Office']
                for (var i = 0; i < keys.length; i++) {
                    if (!dontWant.includes(keys[i])) {
                        var newOption = document.createElement("option");
                        newOption.value = keys[i];
                        newOption.innerHTML = keys[i];
                        chapter.options.add(newOption);
                    }
                }
            });
        });

};

//populate the datatable using a query 
function showData() {
    let params = {
        method: "POST"
    }
    let uurl = "http://165.106.10.170:9999/mongoGetData"

    var formEl = document.forms.movie;
    var formData = new FormData(formEl);
    var movieName = formData.get('movieSelected');

    var chapter = document.getElementById("chapterSelected");
    var text = chapter.options[chapter.selectedIndex].text;

    params['body'] = JSON.stringify({ movie: movieName, chapter: text });

    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                qResult = JSON.parse(text);
                delete qResult["Movie Chapter"];
                document.querySelector("#gt2").innerHTML = tabform1(qResult);
            });
        });

    showTitle(movieName);

};

//populate the title and movie information using a query
function showTitle(movieName) {
    let params = {
        method: "POST"
    }
    let uurl = "http://165.106.10.170:9999/mongoGetTitle"

    params['body'] = JSON.stringify({ movie: movieName });

    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                let titleResults = JSON.parse(text);
                shown = "<h2> " + movieName + " ("
                shown += titleResults["Release Year"] + ") </h2> <p> Runtime: " + titleResults["Runtime"] + ", Budget: " + titleResults["Budget"] + ", Box Office Sales: " + titleResults["Box Office"] + "</p>";
                console.log(titleResults + shown)
                document.querySelector("#gt").innerHTML = shown;
            });
        });
};