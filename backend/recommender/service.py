import torch
from .mf_model import MatrixFactorization, create_mock_data, train_model, get_recommendations
from .models import User, Product, Rating

class RecommendationService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RecommendationService, cls).__new__(cls)
            cls._instance.initialize_service()
        return cls._instance
    
    def initialize_service(self):
        self.df, self.num_users, self.num_items, self.user_ids, self.product_ids = create_mock_data()
        self.model = train_model(self.df, self.num_users, self.num_items)
        self.user_id_to_idx = {user_id: idx for idx, user_id in enumerate(self.user_ids)}
        self.idx_to_product_id = {idx: product_id for idx, product_id in enumerate(self.product_ids)}
    
    def get_recommendations_for_user(self, user_id, num_recommendations=5):
        if user_id not in self.user_id_to_idx:
            return []
            
        user_idx = self.user_id_to_idx[user_id]
        item_indices, ratings = get_recommendations(
            self.model, 
            self.df, 
            user_idx, 
            self.num_items, 
            num_recommendations
        )
        
        return [
            {
                'product_id': self.idx_to_product_id[item_idx],
                'predicted_rating': rating
            }
            for item_idx, rating in zip(item_indices, ratings)
        ]