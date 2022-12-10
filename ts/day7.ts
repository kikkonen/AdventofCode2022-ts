import { readLines } from "./read.js"

class PlainFile {
    name: string
    size: number

    constructor(name: string, size: number) {
        this.name = name
        this.size = size
    }
}

class Directory {
    name: string
    parents: Directory | null
    children: Directory[] = []
    files: PlainFile[] = []

    constructor(name: string, parent: Directory | null) {
        this.name = name
        this.parents = parent
    }

    addFile(file: PlainFile) {
        this.files.push(file)
    }

    addSubDirectory(directory: Directory) {
        this.children.push(directory)
    }

    totalSize(): number {
        let totalFileSize = this.files.reduce((total, file) => total + file.size, 0)
        let totalSubDirsSize = this.children.reduce((total, subDir) => total + subDir.totalSize(), 0)
        return totalFileSize + totalSubDirsSize
    }
}

const regexChangeDir = /(?<=\$ cd ).+/g
const lsCommand = '$ ls'

class MyFileSystem {
    rootDir: Directory = new Directory('root', null)
    currentDir: Directory = this.rootDir
    directoryList: Directory[] = [this.rootDir]
    totalSpace: number

    constructor(totalSpace: number) {
        this.totalSpace = totalSpace
    }

    populateFromConsoleLogs(consoleLogs: string[]) {
        consoleLogs.forEach(log => this.carryOutInstructionInLine(log))
    }

    carryOutInstructionInLine(line: string) {
        if (line == lsCommand) {
            return
        }
        let changeDirMatch = line.match(regexChangeDir)
        if (changeDirMatch) {
            let targetDirName = changeDirMatch[0]
            this.changeCurrentDirectory(targetDirName)
            return
        }
        let lineSplit = line.split(' ')
        if (lineSplit.length != 2) {
            throw `Cant parse line: ${line}`
        }
        if (lineSplit[0] == 'dir') {
            let newDir = new Directory(lineSplit[1], this.currentDir)
            this.currentDir.addSubDirectory(newDir)
            this.directoryList.push(newDir)
        } else {
            let newFile = new PlainFile(lineSplit[1], parseInt(lineSplit[0]))
            this.currentDir.addFile(newFile)
        }

    }

    changeCurrentDirectory(targetDirName: string) {
        if (targetDirName == '/') {
            this.currentDir = this.rootDir
        }
        else if (targetDirName == '..') {
            let newCurrentDir = this.currentDir.parents
            if (newCurrentDir == null) {
                throw `Trying to go up a directory when already at the top directory`
            }
            this.currentDir = newCurrentDir
        }
        else {
            let newCurrentDir = this.currentDir.children.find(dir => dir.name == targetDirName)
            if (newCurrentDir == null) {
                throw `Tried to switch to a non-existing directory ${targetDirName}; ${this.directoryList}`
            }
            this.currentDir = newCurrentDir
        }
    }

    getTotalSize(maxIndividualDirSize: number): number {
        let dirSizes = this.directoryList.map(dir => dir.totalSize())
        dirSizes = dirSizes.filter(size => size <= maxIndividualDirSize)
        return dirSizes.reduce((acum, next) => acum + next, 0)
    }

    getAvailableSpaceLeft(): number {
        return this.totalSpace - this.rootDir.totalSize()
    }

    getMinSizeToDelete(targetSpaceAvailable: number): number {
        let currentSpaceAvailable = this.getAvailableSpaceLeft()
        let minSpaceToFree = targetSpaceAvailable - currentSpaceAvailable
        let candidateDirectories: Directory[] = this.directoryList.filter(dir => dir.totalSize() >= minSpaceToFree)
        return Math.min(...candidateDirectories.map(dir => dir.totalSize()))
    }
}


let logLines = readLines(7)
let fileSystem = new MyFileSystem(70000000)
fileSystem.populateFromConsoleLogs(logLines)
console.log(`Total size in system: ${fileSystem.rootDir.totalSize()}`)
console.log(`Total size in system for dirs under 100000: ${fileSystem.getTotalSize(100000)}`)
console.log(`Minimum size to delete to get to 30000000: ${fileSystem.getMinSizeToDelete(30000000)}`)


