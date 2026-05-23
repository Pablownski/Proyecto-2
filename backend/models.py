from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class Categoria(Base):
    __tablename__ = "categoria"

    category_id = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)

    productos = relationship("Producto", back_populates="categoria")


class Proveedor(Base):
    __tablename__ = "proveedor"

    supplier_id = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)
    phone       = Column(String(20),  nullable=False)
    email       = Column(String(100), nullable=False)

    productos = relationship("Producto", back_populates="proveedor")


class Producto(Base):
    __tablename__ = "producto"

    product_id  = Column(Integer,      primary_key=True, index=True)
    name        = Column(String(100),  nullable=False)
    description = Column(Text,         nullable=False)
    price       = Column(Numeric(10, 2), nullable=False)
    stock       = Column(Integer,      nullable=False)
    category_id = Column(Integer, ForeignKey("categoria.category_id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("proveedor.supplier_id"), nullable=False)

    categoria = relationship("Categoria", back_populates="productos")
    proveedor = relationship("Proveedor", back_populates="productos")


class Cliente(Base):
    __tablename__ = "cliente"

    customer_id = Column(Integer,     primary_key=True, index=True)
    name        = Column(String(100), nullable=False)
    email       = Column(String(100), nullable=False)
    phone       = Column(String(20),  nullable=False)
