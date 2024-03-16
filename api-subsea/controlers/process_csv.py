import pandas as pd
import sys
import json
from datetime import datetime

def process_csv(file_path, tags, start_date_str, end_date_str):
    chunk_size = 50000  # Process 50,000 rows at a time
    stats = {tag: {'min': float('inf'), 'max': float('-inf'), 'sum': 0, 'count': 0} for tag in tags}  # Pre-initialize stats for each tag
    
    # Convert start and end dates to datetime objects
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    # Adjust end_date to include the whole day
    end_date = datetime(end_date.year, end_date.month, end_date.day, 23, 59, 59, 999999)
    
    # Define columns names and types to improve read_csv performance
    column_names = ['tag', 'value', 'date', 'another_value']
    column_types = {'tag': 'int', 'value': 'float', 'date': 'str', 'another_value': 'int'}
    
    # Read CSV in chunks
    for chunk in pd.read_csv(file_path, chunksize=chunk_size, header=None, names=column_names, dtype=column_types):
        # Convert 'date' column to datetime
        chunk['date'] = pd.to_datetime(chunk['date'], format='%Y-%m-%d %H:%M:%S.%f')
        # Filter chunk by date range
        chunk = chunk[(chunk['date'] >= start_date) & (chunk['date'] <= end_date)]
        
        # Process filtered data
        for tag in tags:
            tag_data = chunk[chunk['tag'] == int(tag)]
            if not tag_data.empty:
                min_value = tag_data['value'].min()
                max_value = tag_data['value'].max()
                sum_value = tag_data['value'].sum()
                count_value = len(tag_data)
                
                # Update stats
                tag_stats = stats[tag]
                tag_stats['min'] = min(tag_stats['min'], min_value)
                tag_stats['max'] = max(tag_stats['max'], max_value)
                tag_stats['sum'] += sum_value
                tag_stats['count'] += count_value

    # Finalize calculations
    for tag, data in stats.items():
        if data['count'] > 0:  # Avoid division by zero
            data['average'] = data['sum'] / data['count']
        else:
            data['average'] = None
        del data['sum'], data['count']

    return stats

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python process_csv.py <file_path> <tags_comma_separated> <start_date> <end_date>")
    else:
        file_path = sys.argv[1]
        tags = sys.argv[2].split(',')  # Expecting tags as a comma-separated list
        start_date = sys.argv[3]
        end_date = sys.argv[4]

        results = process_csv(file_path, tags, start_date, end_date)
        print(json.dumps(results, default=str))  # Print the results as a JSON string
