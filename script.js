async function get(){

    let number = getRandomNumber()
    let requestURL = "https://www.acmicpc.net/problem/" + number.toString()

    //rep = await fetch(requestURL, )
    const rep = await fetch(requestURL)

    if (rep.status == 404){
        await get();
    } else {
        result = await rep.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        var text = doc.querySelector('#problem_description').innerText
        var title = doc.querySelector('#problem_title').innerText
        var acceptance = doc.querySelector("#problem-info").getElementsByTagName('tr')[1].getElementsByTagName('td')[5].innerText

        document.querySelector('#result').innerText = text
        document.querySelector('#title').innerText = title
        document.querySelector('#number').innerText = number.toString()
        document.querySelector('#acceptance').innerText = acceptance

        
        document.querySelector('#gobutton').onclick = function(){
            chrome.tabs.executeScript({
                code: "location.replace('" + requestURL + "')"
              });    
        }
    }
    var x = document.querySelector('#loading-container')
    x.style.display = "none"
    return
    }
    
/**
 * @brief get random number in range 1000 to 
 * 
 */
function getRandomNumber(){
    return Math.floor(Math.random() * (8000 - 1000) + 1000)
}


async function getFromLeetCode(){
    let requestURL = "https://leetcode.com/graphql"
    body = JSON.stringify(getQuery({operation:"question", variables:{value:"contains-duplicate", type:"String!"},fields:["title"]})) 
    alert(body)
    const rep = await fetch(requestURL, {
        method: "POST",
        body:body
    });

    if (rep.status == 404){
        await getFromLeetCode();
    } else {
        const result = await rep.json();
        
        //var parser = new DOMParser();
        //var doc = parser.parseFromString(result, "text/html");
        //var text = doc.querySelector('#problem_description').innerText
        //var title = doc.querySelector('#problem_title').innerText
        //var acceptance = doc.querySelector("#problem-info").getElementsByTagName('tr')[1].getElementsByTagName('td')[5].innerText

        document.querySelector('#result').innerText = result.stringify()
        //document.querySelector('#title').innerText = title
        //document.querySelector('#number').innerText = number.toString()
        //document.querySelector('#acceptance').innerText = acceptance

        
        /*document.querySelector('#gobutton').onclick = function(){
            chrome.tabs.executeScript({
                code: "location.replace('" + requestURL + "')"
              });    
        }*/
    }

}
function getQuery(query) {
    /**
     *  "operation" : "question"
     *  "variables" : {titleslug : {value:"abc", "type":"String!"}}
     *  "field" : [XX, XX, XX, XX]
    */
    var operation = query["operation"] // operation
    var variables = query["variables"]
    var variableQuery = variableProcessing(variables)
    var fields = query["fields"]
    var fieldQuery = fieldProcessing(fields)
    return {variables : variableQuery[2], query: queryProcessing(operation,variableQuery,fieldQuery)}
}


//process the field
function fieldProcessing(fieldlist){
    return fieldlist.reduce((prev,current, idx, array)=>{
        if (array.length -1 === idx) {
            return prev + current
        }
        return prev + current + ", "
    },"")
}

function variableProcessing(variables){
    return Object.keys(variables).reduce((prev, current) => {
        prev[0] += "($" + variables[current]["value"] + ":" + variables[current]["type"] + ")"
        prev[1] += "(" + variables[current]["value"] + ":" + "$" + variables[current]["value"] + ")"
        prev[2][current] = variables[current]["value"]
        return prev
    }, ["","", {}])
}

function queryProcessing(operation, variableQuery,fieldQuery){
    return "query" + variableQuery[0] + "{\n" + operation + variableQuery[1] + "{\n" + fieldQuery + "}\n}" 
}

document.addEventListener("DOMContentLoaded", function(){ getFromLeetCode() }, false);





