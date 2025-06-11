# recommender/mf_model.py
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

class MatrixFactorization(nn.Module):
    def __init__(self, num_users, num_items, embedding_size=20):
        super(MatrixFactorization, self).__init__()
        self.user_embed = nn.Embedding(num_users, embedding_size)
        self.item_embed = nn.Embedding(num_items, embedding_size)

    def forward(self, user, item):
        return (self.user_embed(user) * self.item_embed(item)).sum(1)

def create_mock_data(num_users=50, num_products=30):
    np.random.seed(42)
    user_ids = [f'user_{i}' for i in range(1, num_users + 1)]
    product_ids = [f'product_{j}' for j in range(1, num_products + 1)]

    data = []
    for user_idx, user in enumerate(user_ids):
        rated_products = np.random.choice(product_ids, size=np.random.randint(1, 10), replace=False)
        for product in rated_products:
            rating = np.random.randint(1, 6)
            product_idx = product_ids.index(product)
            data.append((user_idx, product_idx, rating))

    df = pd.DataFrame(data, columns=['user_id', 'product_id', 'rating'])
    return df, len(user_ids), len(product_ids), user_ids, product_ids

def train_model(df, num_users, num_items, epochs=20, lr=0.01):
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
    model = MatrixFactorization(num_users, num_items)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    train_users = torch.LongTensor(train_df['user_id'].values)
    train_items = torch.LongTensor(train_df['product_id'].values)
    train_ratings = torch.FloatTensor(train_df['rating'].values)

    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        preds = model(train_users, train_items)
        loss = criterion(preds, train_ratings)
        loss.backward()
        optimizer.step()

    return model

def get_recommendations(model, df, user_id, num_items, num_recommendations=5):
    rated_items = df[df['user_id'] == user_id]['product_id'].values
    all_items = np.arange(num_items)
    unrated_items = [item for item in all_items if item not in rated_items]

    user_tensor = torch.LongTensor([user_id] * len(unrated_items))
    item_tensor = torch.LongTensor(unrated_items)

    model.eval()
    with torch.no_grad():
        predicted_ratings = model(user_tensor, item_tensor)

    top_indices = predicted_ratings.argsort(descending=True)[:num_recommendations]
    recommended_items = [unrated_items[i] for i in top_indices]
    ratings = predicted_ratings[top_indices].tolist()
    return recommended_items, ratings
