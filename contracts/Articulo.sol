// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArticuloFactory {
    address[] public articulos;
    mapping(string => address) public tituloToAddress;

    function crearArticulo(string memory titulo, string memory contenido) public {
        address newArticulo = address(new Articulo(titulo, contenido));
        tituloToAddress[titulo] = newArticulo;
        articulos.push(newArticulo);
    }

    function getArticulos() public view returns(address[] memory) {
        return articulos;
    }
}

contract Articulo {
    string public titulo;
    string public contenido;

    constructor(string memory _titulo, string memory _contenido) {
        titulo = _titulo;
        contenido = _contenido;
    }

    function setTitulo(string memory _titulo) public {
        titulo = _titulo;
    }

    function setContenido(string memory _contenido) public {
        contenido = _contenido;
    }
}