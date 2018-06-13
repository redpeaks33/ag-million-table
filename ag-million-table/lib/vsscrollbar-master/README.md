# vsscrollbar v. 0.1.6
**Virtual scroll with filtering and custom scrollbar - AngularJS reusable UI component**

## Description
AngularJS directive which implements the virtual scroll, filtering of the items and the customizable scrollbar

### 1. virtual scroll
* good performance even millions of the items in the list
* only visible items are rendered in the browser

### 2. filtering
* if scrollbar items are array of strings - filtering by string value
* if scrollbar items are array of objects - filtering by string from all properties of the object

### 3. customizable scrollbar
* custom scrollbar is used instead of native scrollbar of the browser
* scrollbar can be easily customised using the CSS
* scrollbar is looking similar in all browsers

## Usage

* include the **vsscrollbar-0.1.6.min.js** and the **vsscrollbar-0.1.6.min.css** files into your project. See the **Build project** and the **Installation** chapters below.
```html
<script src="vsscrollbar-0.1.6.min.js"></script>
<link href="vsscrollbar-0.1.6.min.css" rel="stylesheet" type="text/css">
```
* inject the **vsscrollbar** module into your application module.
```js
angular.module('vssampleapp', ['vsscrollbar']);
```
* add **vsscrollbar** HTML tag into your HTML file. See the **HTML example** paragraph below.
* add needed Javascript code. See the **Javascript example** paragraph below.

### HTML example
```html
<vsscrollbar items="allItems" items-in-page="5"
             on-scroll-change-fn="onScrollChange(topIndex, maxIndex, topPos, maxPos, 
                                  filteredPageCount, filteredItemCount, visibleItems)"
             on-focus-scrollbox-fn="onFocusScrollbox(focused)">
    <!- parent implements this part - begin -->                              
    <div id="item" ng-repeat="item in visibleItems track by $index" 
                   ng-click="itemClicked($index, item);">
        <div id="itemtext">{{item}}</div>
    </div>
    <!- parent implements this part - end -->
</vsscrollbar>
```

It is also possible to use **ng-model="response"** instead of **on-scroll-change-fn** callback to get responses from the scrollbar component.

### Tags
| Tag  | Description | Mandatory | 
| :------------ |:---------------|:---------------:|
| vsscrollbar | scrollbar tag | yes | 
| div inside the vsscrollbar | parent is responsible to implement this part | yes | 


### Attributes
| Attribute | Description | Mandatory | 
| :------------ |:---------------|:---------------:|
| items | items passed to the vsscrollbar - parent can change content of the items variable by using service methods | yes |
| items-in-page | visible item count in the vsscrollbar | yes |
| height | height of the scrollbar | no |
| on-scroll-change-fn | callback function which is called by the vsscrollbar when the scroll change occurs | yes if *ng-model* is not used |
| on-focus-scrollbox-fn | callback function which is called by the vsscrollbar when the scrollbox get/lost focus | no |
| ng-model | updated by the vsscrollbar when scroll change occurs | yes if *on-scroll-change-fn* is not used |


### Javascript example
```js
var sampleapp = angular.module('vssampleapp', ['vsscrollbar']);
sampleapp.controller('vsScrollbarCtrl', function ($scope, vsscrollbarEvent, vsscrollbarConfig) {
    $scope.visibleItems = [];
    
    // Scrollbox focus/blur callback - invoked when the scrollbox get/lost focus
    $scope.onFocusScrollbox = function (focused) {
        console.log('onFocusScrollbox(): focused: ', focused);
    };
    
    // Scroll change callback - **visibleItems** are shown in the scrollbar using the **ng-repeat**. See above.
    $scope.onScrollChange = function (topIndex, maxIndex, topPos, maxPos, 
                                      filteredPageCount, filteredItemCount, visibleItems) {
        $scope.visibleItems = visibleItems;
        ...
    };
};

```

By injecting the **vsscrollbarEvent** the parent can send events to the vsscrollbar component by calling service functions. 

For example add item named "**My item**" to the index "**2**".

```js
vsscrollbarEvent.addItem($scope, 2, 'My item');
```

| Function | Parameters | Description | 
| :------------ |:---------------|:---------------|
| setIndex | $scope, index | Set the vsscrollbar index to this position. Moves the scroll if needed. |
| setPosition | $scope, position | Set the vsscrollbar position. Moves the scroll if needed. |
| filter | $scope, filterStr | Filter items from the vsscrollbar by the given string. See below **Filtering items**|
| addItem | $scope, index, item | Adds item to the position of the index. Value of the item is **string** or **JSON object** depending of the types of the items in the list. |
| updateItem | $scope, index, item | Replaces item in the position of the index. Value of the item is **string** or **JSON object** depending of the types of the items in the list. |
| deleteItem | $scope, index | Deletes item from the position of the index. |


#### Filtering items
1) Items are array of strings
```js
/*
['Item #20', 'Item #21', 'Item #30', 'Item #40']
*/

vsscrollbarEvent.filter($scope, '2');
```
Result of the above filter command is two items, because two items contain the string **2**.

2) Items are array of objects
```js
/*
[{
    "id":0,
    "code":"EI",
    "name":"ABC"
},
{
    "id":1,
    "code":"DD",
    "name":"DEF"
}]
*/

vsscrollbarEvent.filter($scope, 'e');
```
Result of the above filter command is two objects, because two objects contain the string **e**.


In the **examples** folder of this project has the sample app and the online demos 
are [here](http://kekeh.github.io/vsscrollbar)

## Dependencies
Depends on AngularJS. Implemented using the AngularJS version 1.4.3.

## Build project
* Build can be done by executing the **grunt** command. It creates the **dist/debug** and the **dist/min** folders and put files to these folders.
```js
grunt
```

## Installation
* Installation can be done using the **bower**. It installs files from the **dist/debug** and the **dist/min** folders. Needed CSS and javascript files are located in these folders.
```js
bower install vsscrollbar
```

## Compatibility (tested with)
* IE 9+
* Safari 5
* Firefox 36.0.4
* Google Chrome 41.0.2272.101
* Opera 28.0

## License
* License: MIT

## Author
* Author: kekeh

