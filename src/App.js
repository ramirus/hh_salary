import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

import logo from './hh.svg';
import './App.css';
import AreaInput from './components/AreaInput';
import PositionInput from './components/PositionInput';
import Graph from './components/Graph';
import 'antd/dist/antd.css';

class App extends Component {
  state = {
    countryId: null,
    regionId: null,
    cityId: null,
    vacancy: null,
    vacancies: [],
    isHideSearch: false,
  };

  fetchData = (params) =>
    fetch(`https://api.hh.ru/vacancies?${params}`)
      .then(response => response.json())


  fetchVacancies = (vacancy) => {
    const params = `text=${vacancy}&area=${this.state.cityId}&per_page=100`
    this.fetchData(params).then(data => {
      const pageCount = data.pages;
      const promicies = [];
      let vacancies = [];
      vacancies = vacancies.concat(data.items);
      for (let i = 1; i < pageCount; i++) {
        const curParams = `text=${vacancy}&area=${this.state.cityId}&per_page=100&page=${i}`;
        promicies.push(
          this.fetchData(curParams)
        )
      }
      Promise.all(promicies).then(results => {
        results.forEach(item => {
          vacancies = vacancies.concat(item.items)
        });
        this.setState({ vacancies });
      });
      console.log(data.pages)
    })
  }

  handleAreaChoose = (title, value) => {
    this.setState({
      [title]: value
    })
  };

  handleSubmit = (vacancy) => {
    this.fetchVacancies(vacancy);
    this.setState({
      vacancy,
      isHideSearch: true,
    })
  }

  render() {
    const { countryId, regionId, cityId, vacancies, isHideSearch } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">HH salary monitoring</h1>
        </header>
        {
          !isHideSearch ?
            <div className="area-block">
              <AreaInput
                title='Страна'
                name='countryId'
                handleAreaChoose={this.handleAreaChoose}
              />
              {
                countryId &&
                <AreaInput
                  title='Регион'
                  name='regionId'
                  areaId={countryId}
                  handleAreaChoose={this.handleAreaChoose}
                />
              }
              {
                regionId &&
                <AreaInput
                  title='Город'
                  name='cityId'
                  areaId={regionId}
                  handleAreaChoose={this.handleAreaChoose}
                />
              }
              {
                cityId &&
                <PositionInput
                  title='Вакансия'
                  handleSubmit={this.handleSubmit}
                />
              }

            </div>
            :
            vacancies.length > 0 &&
            <Graph
              vacancies={vacancies}
            />
        }

      </div>
    );
  }
}

export default App;
