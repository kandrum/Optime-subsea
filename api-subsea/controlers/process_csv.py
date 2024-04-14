import pandas as pd
import sys
import json
from datetime import datetime

def process_csv(file_path, tags, start_date_str, end_date_str):
    chunk_size = 50000  # Process 50,000 rows at a time
    # Initialize stats for each tag and a separate dictionary for date averages
    stats = {tag: {'min': float('inf'), 'max': float('-inf'), 'sum': 0, 'count': 0} for tag in tags}
    date_values = {}

    # Convert start and end dates to datetime objects
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    end_date = datetime(end_date.year, end_date.month, end_date.day, 23, 59, 59, 999999)

    # Define column names and types to improve read_csv performance
    column_names = ['tag', 'value', 'date', 'another_value']
    column_types = {'tag': 'int', 'value': 'float', 'date': 'str', 'another_value': 'int'}

    # Read CSV in chunks
    for chunk in pd.read_csv(file_path, chunksize=chunk_size, header=None, names=column_names, dtype=column_types):
        # Convert 'date' column to datetime and filter by range
        chunk['date'] = pd.to_datetime(chunk['date'], format='%Y-%m-%d %H:%M:%S.%f')
        chunk = chunk[(chunk['date'] >= start_date) & (chunk['date'] <= end_date)]
        
        # Aggregate data by date
        for date, group in chunk.groupby(chunk['date'].dt.date):
            str_date = str(date)
            if str_date not in date_values:
                date_values[str_date] = {'sum': 0, 'count': 0}
            date_values[str_date]['sum'] += group['value'].sum()
            date_values[str_date]['count'] += len(group)

        # Process filtered data for tag stats
        for tag in tags:
            tag_data = chunk[chunk['tag'] == int(tag)]
            if not tag_data.empty:
                tag_stats = stats[tag]
                tag_stats['min'] = min(tag_stats['min'], tag_data['value'].min())
                tag_stats['max'] = max(tag_stats['max'], tag_data['value'].max())
                tag_stats['sum'] += tag_data['value'].sum()
                tag_stats['count'] += len(tag_data)

    # Finalize calculations
    for tag, data in stats.items():
        if data['count'] > 0:
            data['average'] = data['sum'] / data['count']
        else:
            data['average'] = None
        del data['sum'], data['count']  # Clean up data structure

    # Calculate and format date averages
    date_averages = {}
    for date, values in date_values.items():
        if values['count'] > 0:
            date_averages[date] = values['sum'] / values['count']
        else:
            date_averages[date] = None

    return {'stats': stats, 'date_averages': date_averages}

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python process_csv.py <file_path> <tags_comma_separated> <start_date> <end_date>")
    else:
        file_path = sys.argv[1]
        tags = sys.argv[2].split(',')
        start_date = sys.argv[3]
        end_date = sys.argv[4]

        results = process_csv(file_path, tags, start_date, end_date)
        print(json.dumps(results, default=str))  # Print the results as a JSON string
