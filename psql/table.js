
/**
 * Create an html table from a bunch of data in JSON form. 
 * Where the JSON form is an array of objects
 * @param dbres -- the JSON data
 * @returns an HTML table
 */
function tabform1(dbres) {
    let tbl = '<table border="1" class="search_results">';
    let keyss = ["character_name", "place_name", "dialogue"]
    tbl += "<tr>";
    for (let k of keyss) {
            tbl += "<th><button onclick='doReSort(\"" + k + "\")'>" + k + "</button></th>"
    }

    tbl += "</tr>";
    dbres.forEach(element => {
        tbl += "<tr>";
        keyss.forEach(k => {
            let extra = ""
            if(k == "character_name"){
                extra = "Gender: " + element["gender"] + "\nHouse: " + element["house"] + "\nPatronus: " + element["patronus"] + "\nWand_wood: " + element["wand_wood"] + "\nWand_core: " + element["wand_core"];
                tbl += "<td class=\"CellWithComment\"> " + element[k] + " <span class=\"CellComment\">" + extra +"</span> </td>";
            }else if(k == "place_name"){
                extra = "Place Category: " + element["place_category"];
                tbl += "<td class=\"CellWithComment\"> " + element[k] + " <span class=\"CellComment\">" + extra +"</span> </td>";
            }else{
                tbl += "<td>" + element[k] + "</td>"
            }
        });
        tbl += "</tr>";
    });
    tbl += "</table>";
    return tbl;
}


let qResult = null;

/**
 * Sort the retrieved data by the given key. 
 * Then reformat it into a table.
 * @param {} field the field on which to sort.
 */
function doReSort(field) {
    sortBy(field);
    document.querySelector("#gt2").innerHTML = tabform1(qResult);
}

/**
 * Actually do the Sorting
 * @param {} pName the field by which to sort
 */
function sortBy(pName) {
    function compare(a, b) {
        if (a[pName] < b[pName]) {
            return -1;
        }
        if (a[pName] > b[pName]) {
            return 1;
        }
        return 0;
    }
    qResult.sort(compare);
    console.log(`sorted on ${pName}`);
    //console.log(qResult);
}

//do a query to Postgres and return the result as JSON to populate the chapter dropdown
function pgPopulateChapter(movieObject, chapterObject) {
    var movie = document.getElementById(movieObject);
    var chapter = document.getElementById(chapterObject);
    chapter.innerHTML = "";
    let params = {
        method: "POST"
    }
    let uurl = "http://165.106.10.170:9999/pgChapter"
    params['body'] = JSON.stringify({ movie: movie.value });

    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                qResult = JSON.parse(text);

                for (var i = 0; i < qResult.length; i++) {
                    var obj = qResult[i].chapter_name;
                    var value = qResult[i];
                    if (obj.includes('\'')) {
                        splited = obj.split("\'")
                        value = ""
                        for (let i = 0; i < splited.length-1; i ++){
                            value += splited[i] + "\'\'"
                        }
                        value += splited[splited.length-1]
                    }
                    var newOption = document.createElement("option");
                    newOption.value = value;
                    newOption.innerHTML = obj;
                    chapter.options.add(newOption);
                }
            });
        });

};

//Do a query to populate the datatable once the chapter and movie are given
function showData() {
    let params = {
        method: "POST"
    }
    let uurl = "http://165.106.10.170:9999/pgGetData"

    var formEl = document.forms.movie;
    var formData = new FormData(formEl);
    var movieName = formData.get('movieSelected');
    showTitle(movieName);

    var chapter = document.getElementById("chapterSelected");
    var text = chapter.options[chapter.selectedIndex].text;

    params['body'] = JSON.stringify({ movie: movieName, chapter: text });

    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                qResult = JSON.parse(text);
                document.querySelector("#gt2").innerHTML = tabform1(qResult);

            });
        });

};

//Do a query to showcase the title information about the selected movie
function showTitle(movieName) {
    let params = {
        method: "POST"
    }
    let uurl = "http://165.106.10.170:9999/pgTitle"

    params['body'] = JSON.stringify({ movie: movieName});

    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                qResult = JSON.parse(text);
                shown = "<h2> " + movieName + " ("
                qResult.forEach(element => {
                    shown += element["release_year"] + ") </h2> <p> Runtime: " + element["runtime"] + ", Budget: " + element["budget"] + ", Box Office Sales: " + element["box_office"] + "</p>";
                });
                document.querySelector("#gt").innerHTML = shown;

            });
        });

};