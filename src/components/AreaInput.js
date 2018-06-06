import React, { Component } from 'react';
import { Select, Form } from 'antd';
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

const fetchData = (areaId) =>
        fetch(`https://api.hh.ru/areas/${areaId}`)
            .then(response => response.json())
            .then((d) => {
                const data = [];
                let result = d;
                if (areaId) {
                    result = d.areas;
                }
                result.forEach((r) => {
                    data.push({
                        value: r.id,
                        text: r.name,
                    });
                });
                return data;
            });

class AreaInput extends Component {
    state = {
        data: [],
        value: ''
    };

    componentDidMount() {
        let { areaId } = this.props;
        areaId = areaId ? areaId : '';
        fetchData(areaId).then(data => {
            this.setState({data});  
        });
    };

    componentDidUpdate(prevProps, prevState) {
        let { areaId } = this.props;
        const oldAreaId = prevProps.areaId;
        console.log(areaId);
        if(areaId !== oldAreaId) {
            console.log('new');
            areaId = areaId ? areaId : '';
            fetchData(areaId).then(data => {
                this.setState({data});  
            });
        }
    }

    handleChange = (value, ...params) => {
        if (isNaN(parseInt(params[0].key, 10))) {
            this.setState({ value: value });
        }
    }

    handleSelect = (value, ...params) => {
        const { name, handleAreaChoose } = this.props;
        handleAreaChoose(name, value);
        this.setState({ value: params[0].props.children });
    }

    handleFilter = (inputValue, option) => {
        const input = inputValue.toLowerCase();
        const optionName = option.props.children.toLowerCase()
        return optionName.indexOf(input) !== -1
    }

    render() {
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
        const { title } = this.props;
        return (
            <FormItem
                label={title}
                {...formItemLayout}
            >
                <Select
                    mode="combobox"
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    style={{ width: 200 }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={this.handleFilter}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                    {options}
                </Select>
            </FormItem>
        );
    }
}

export default AreaInput;
