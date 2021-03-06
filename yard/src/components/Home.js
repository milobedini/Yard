import React, { useState, useEffect } from 'react'
import '../styles/Home.scss'
import Product from './Product'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { useStateValue } from './StateProvider'
import FilterButton from './FilterButton'
import Search from './Search'
import hero from '../images/hero.jpg'

const filterMap = {
  All: () => true,
  Activity: (item) => item.category.includes('Activity'),
  Books: (item) => item.category.includes('Books'),
  DIY: (item) => item.category.includes('Diy') || item.category.includes('DIY'),
  Electronics: (item) => item.category.includes('Electronics'),
  Films: (item) => item.category.includes('Films'),
  Garden: (item) => item.category.includes('Garden'),
  Health: (item) => item.category.includes('Health'),
  Home: (item) => item.category.includes('Home'),
  Kitchen: (item) => item.category.includes('Kitchen'),
  Music: (item) => item.category.includes('Music'),
  Sports: (item) => item.category.includes('Sports'),
  Toys: (item) => item.category.includes('Toys'),
}

const filterNames = Object.keys(filterMap)

const Home = () => {
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue()

  const [items, setItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const itemsRef = collection(db, 'products')

  const [filter, setFilter] = useState('All')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(itemsRef)
      setItems(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      )
      setAllItems(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      )
    }
    getItems()
    // eslint-disable-next-line
  }, [])
  console.log(items)
  const filterList = filterNames.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ))

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-top">
          <img className="home-image" src={hero} alt="hero" />
          <div className="yard-title">
            <h1>Welcome to Yard</h1>
          </div>
          <div className="top-options">
            {user ? (
              <div className="list-product">
                <Link to="/add">
                  <div className="list-product-link">
                    <h3>List A Product</h3>
                  </div>
                </Link>
              </div>
            ) : null}
            <div className="categories-search">
              <ul className="categories">{filterList}</ul>
              <Search
                handleSearch={setSearchText}
                placeholder="Search our stock"
                data={allItems}
                setItems={setItems}
                items={items}
              />
            </div>
          </div>
        </div>

        <div className="item-list">
          {items
            .filter(filterMap[filter])
            .filter((item) => item.title.toLowerCase().includes(searchText))
            .map((item) => {
              return (
                <Product
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  rating={item.rating}
                  image={item.image}
                  category={item.category}
                  ownerid={item.ownerid}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Home
