/**
 * associative hash table
 * @author https://mojavelinux.com/articles/javascript_hashes.html
 */

class MyHashTable
{
    constructor() {
        this.length = 0;
        this.items = {};    
    }

    setItem(key, value) {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    getItem(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    hasItem(key) {
        return this.items.hasOwnProperty(key);
    }

    removeItem(key) {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    getKeys() {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    getvalues() {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    forEach(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    clear() {
        this.items = {}
        this.length = 0;
    }
}

module.exports = MyHashTable;