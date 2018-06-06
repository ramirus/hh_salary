import React, { Component } from 'react';
import { List } from 'antd';


class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.vacancies.filter(item => item.salary && item.salary.from && item.salary.currency === 'RUR'),
            min: null,
            max: null,
            avg: null,
        }
    }

    handleBarClick = (element, id) => {
        console.log(`The bin ${element.text} with id ${id} was clicked`);
    }

    componentDidMount() {
        let avg, sum = 0;
        const data = this.state.data;
        let min = data[0].salary.from;
        let max = data[0].salary.from;
        data.forEach(item => {
            const salary = item.salary.from;
            if (salary > max) {
                max = salary;
            }
            if (salary < min) {
                min = salary;
            }
            sum += salary;
        })
        data.sort((a, b) => a.salary.from - b.salary.from)
        avg = Math.round(sum / data.length);
        this.setState({
            min, max, avg, data
        })
    };



    render() {
        console.log(this.state.data);
        const { min, max, avg, data } = this.state;
        return (
            <div>
                <dl>
                    <dt>Минимальная зп:</dt>
                    <dd>{min} р.</dd>
                    <dt>Максимальная зп:</dt>
                    <dd>{max} р.</dd>
                    <dt>Средняя зп:</dt>
                    <dd>{avg} р.</dd>
                </dl>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                            title={<a href={item.alternate_url}>{item.name + ' - ' +item.employer.name }</a>}
                            description={item.salary.from + 'р.'}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default Graph;
