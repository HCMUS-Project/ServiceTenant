import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(process.env.NEST_PUBLIC_SUPABASE_URL, process.env.NEST_PUBLIC_SUPABASE_ANON_KEY);
  }

  async getSupabaseStorageImage(imageFilename, supabase): Promise<string> {
    const { data } = supabase.storage.from('datn.product').getPublicUrl(imageFilename)
  
    if (data) {
      return data.publicUrl
    }
  }

  async uploadImageAndGetLink(imageBase64: string): Promise<string> {
    try {
      const imageData = Buffer.from(imageBase64, 'base64');
      
      // Tải lên hình ảnh lên Supabase với định dạng PNG
      const imageName = "products/" + uuidv4()
      const { data, error } = await this.supabase.storage
        .from('datn.product')
        .upload(imageName, imageData, {
          contentType: `image/png`,
        });

      if (error) {
        throw new Error(error.message);
      }

      const imageUrl = this.getSupabaseStorageImage(imageName, this.supabase)
      return imageUrl;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
