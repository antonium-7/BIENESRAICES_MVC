/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/menuNav.js":
/*!***************************!*\
  !*** ./src/js/menuNav.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n    const menuBtn = document.getElementById('menu-btn');\n    const menu = document.getElementById('menu-items');\n    const body = document.body;\n\n    // Función para mostrar el menú\n    function toggleMenu() {\n        menu.classList.toggle('translate-x-full');\n        menu.classList.toggle('translate-x-0');\n    }\n\n    // Mostrar el menú al hacer clic en el botón\n    menuBtn.addEventListener('click', function(event) {\n        event.stopPropagation(); // Evita que el clic en el botón se propague\n        toggleMenu();\n    });\n\n    // Ocultar el menú al hacer clic fuera del menú\n    document.addEventListener('click', function(event) {\n        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {\n            if (!menu.classList.contains('translate-x-full')) {\n                toggleMenu();\n            }\n        }\n    });\n\n    // También puedes ocultar el menú al hacer clic en el botón de menú si está visible\n    menu.addEventListener('click', function(event) {\n        event.stopPropagation(); // Evita que el clic en el menú se propague\n    });\n})();\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/menuNav.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/menuNav.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;