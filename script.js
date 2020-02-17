//geeksforgeeks
//Hackerrank
//codeforces.com
//leetcode.com
//acimp.com

var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) { 
    $scope.test = "nld"
    $scope.test2 = $scope.test

});


async function get(){

    let number = getRandomNumber()
    let requestURL = "https://www.acmicpc.net/problem/1002" //+ number.toString()
    getRandomNumber2()

    //rep = await fetch(requestURL, )
    const rep = await fetch(requestURL)

    if (rep.status == 404){
        await get();
    } else {
        result = await rep.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        var text = doc.querySelector('#problem_description').innerHTML //innerHTML
        var title = doc.querySelector('#problem_title').innerText
        var acceptance = doc.querySelector("#problem-info").getElementsByTagName('tr')[1].getElementsByTagName('td')[5].innerText
        document.querySelector('#result').innerHTML = text
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
    



async function getFromLeetCode(){

    let fetchingURL = "https://leetcode.com/api/problems/all/"
    const fetchResponse = await fetch(fetchingURL)
    const parsedFetchResponse = await fetchResponse.json()
    const problemInfo = parsedFetchResponse.stat_status_pairs[getRandomNumber2()]

    const titleSlug = problemInfo.stat.question__title_slug
    let requestURL = "https://leetcode.com/graphql"
    a = getQuery({operation:"question", variables:{titleSlug:{value:titleSlug, type:"String!"}},fields:["title", "content"]})
    const response = await fetch(requestURL,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(a)
    })
    const parsed = await response.json()
    document.querySelector('#result').innerHTML = parsed.data.question.content


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

//{"variables":{"titleSlug":"contains-duplicate"},"query":"query question($titleSlug:String!) { question(titleSlug:$titleSlug){title}}"}
//{"variables":{"titleSlug":"contains-duplicate"},"query":"query($titleSlug:String!){\nquestion(titleSlug:$titleSlug){\ntitle}\n}"}
function variableProcessing(variables){
    return Object.keys(variables).reduce((prev, current) => {
        prev[0] += "($" +current+ ":" + variables[current]["type"] + ")"
        prev[1] += "(" + current + ":" + "$" + current + ")"
        prev[2][current] = variables[current]["value"]
        return prev
    }, ["","", {}])
}

function queryProcessing(operation, variableQuery,fieldQuery){
    return "query " + operation + variableQuery[0] + "{" + operation + variableQuery[1] + "{" + fieldQuery + "}}" 
}




/**
 * @brief get random number in range 1000 to 
 * 
 */
function getRandomNumber(){
    return Math.floor(Math.random() * (8000 - 1000) + 1000)
} // how to get total number of the

function getRandomNumber2(){
    return Math.floor(Math.random() * (1340 - 0))
} // how to get total number of the

//starts
//need web rececving.
document.addEventListener("DOMContentLoaded", function(){ getFromLeetCode() }, false);

