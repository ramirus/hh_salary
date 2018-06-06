import React, { Component } from 'react';
import { Select, Form, Button } from 'antd';
import fetch from 'isomorphic-fetch';

const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

let timeout;
let currentValue;

function fetchData(value, callback) {
    console.log(value);
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake() {
        console.log(currentValue);
        if(currentValue.length > 1) {
            fetch(`https://api.hh.ru/suggests/vacancy_search_keyword?text=${currentValue}`)
                .then(response => response.json())
                .then((d) => {
                    const data = [];
                    let result = d.items;
                    console.log(result);
                    result.forEach((r) => {
                    data.push({
                            value: r.text,
                            text: r.text,
                        });
                    });
                    callback(data);
                });
        }
    }
    timeout = setTimeout(fake, 300);
}

class PositionInput extends Component {
  state={
    data: [],
    value: ''
  };

  componentDidMount() {
  };

  handleChange = (value) => {
    this.setState({ value });
    fetchData(value, data => this.setState({ data }));
  }

  handleSelect = (value) => {
    const {handleSubmit} = this.props;
    handleSubmit(value);
  }

  handleClick = () => {
      const {handleSubmit} = this.props;
      handleSubmit(this.state.value);
  }


  render() {
    const {title} = this.props;
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

    return (
        <FormItem
            label={title}
            {...formItemLayout}
        >
            <Select
                mode="combobox"
                value={this.state.value}
                style={{width: 200}}
                placeholder='Название вакансии'
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={this.handleFilter}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
            >
                {options}
            </Select>
            <Button
                type="primary"
                shape="circle"
                icon="search"
                onClick={this.handleClick}
            />
      </FormItem>
    );
  }
}

export default PositionInput;
