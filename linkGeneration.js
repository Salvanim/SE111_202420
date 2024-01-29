import { Octokit } from "octokit";

    const octokit = new Octokit({ 
        auth: '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',
    });

    function getData(username, repo, path){
        const urlString = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
        const request = new XMLHttpRequest();
        request.open("GET", urlString, false);
        request.send(null);

        if (request.status === 200) {
            return JSON.parse(request.responseText);
        }

        return null;
    }

    function seperateDirectories(data){
        const types = data.map(item => item.type);
        const length = types.length
        var directories = []
        var files = []
        for(var i = 0; i < length; i++){
            if(types[i] == 'dir'){
                directories.push(data[i])
            } else {
                files.push(data[i])
            }
        }
        return {"dir": directories, "files": files};
    }

    function itterativeSearch(username, repo, startPath, files = []){
        var dir = []
        var seperated = seperateDirectories(getData(username, repo, startPath))
        files.push(seperated['files'])
        dir = seperated['dir']
        for(dictionarys in dir){
            var currentDictionary = dir[dictionarys]
            var path = currentDictionary['path']
            files = itterativeSearch(username, repo, path, files)
        }
        files = [].concat.apply([], files);
        return files
    }

    function getFilesByName(username, repo, name){
        originalSearch = itterativeSearch(username, repo, "")
        filesByName = []
        for(dict in originalSearch){
            if(originalSearch[dict]["name"] == name){
                filesByName.push(originalSearch[dict])
            }
        }
        return filesByName
    }

    console.log(getData("Salvanim", "SE111_202420", ""))
