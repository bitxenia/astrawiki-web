// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Articulo.sol";

contract ArticuloFactory {
    address[] public articulos;
    mapping(string => address) public tituloToAddress;

    function crearArticulo(
        string memory titulo,
        string memory contenido
    ) public {
        address newArticulo = address(new Articulo(titulo, contenido));
        tituloToAddress[titulo] = newArticulo;
        articulos.push(newArticulo);
    }

    function getArticulos() public view returns (address[] memory) {
        return articulos;
    }
}
